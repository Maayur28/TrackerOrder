const dbModel = require("../utilities/connection");
const axios = require("axios");
const cheerio = require("cheerio");

let userModel = {};

async function fetchHTML(url) {
  const { data } = await axios.get(url)
  return cheerio.load(data);
}

userModel.getPrice=async(url)=>{
  const $ = await fetchHTML(url)
    let price=$("._30jeq3").html();
    let fname=$('.G6XhRU').html();
    let lname=$('.B_NuCI').html();
    let name='';
    if(fname)
    name=fname.slice(0,fname.indexOf('&nbsp')) + '-' 
    if(lname)
    {
      let inde=lname.indexOf('<!-- -->');
      if(inde!=-1)
      name=name + lname.slice(0,lname.indexOf('<!-- -->'));
      else
      name=name+lname.slice(0,);
    }
    let obj={};
    obj.name=name;
    obj.price=price;
    return obj;
    // price=price.html().replace(/,/g,'').slice(redu.indexOf(';')+1,);
    // price=price.replace(/,/g,'').slice(1,);
}

userModel.addtoTracking = async (prod) => {
  let model = await dbModel.getOrderConnection();
  let getorder = await model.findOne({ userid: prod.userid });
  if (!getorder) {
    let obj = {};
    obj.userid = prod.userid;
    obj.email=prod.email;
    delete prod.userid;
    delete prod.email;
    obj.trackingItem = [];
    let addorder = await model.create(obj);
    if (addorder) {
      {
        let addprod = await model.updateOne(
          { userid: obj.userid },
          { $push: { trackingItem: prod } }
        );
        if (addprod.nModified > 0) return await model.find();
        else {
          let err = new Error();
          err.status = 500;
          err.message =
            "Sorry! Server is busy,Please try removing from wishlist after sometime";
          throw err;
        }
      }
    } else {
      let err = new Error();
      err.status = 500;
      err.message =
        "Sorry! Server is busy,Please try removing from wishlist after sometime";
      throw err;
    }
  } else {
    let id = prod.userid;
    delete prod.userid;
    delete prod.email;
    let _id=0;
    for(let i of getorder.trackingItem)
    {
      if(i)
      {
        if(i._id>_id)
        _id=i._id
      }
    }
    prod._id=_id+1;
    let pushitem = await model.updateOne(
      { userid: id },

      { $push: { trackingItem: prod } }
    );
    if (pushitem.nModified > 0) {
      return await model.find();
    } else {
      let err = new Error();
      err.status = 500;
      err.message =
        "Sorry! Server is busy,Please try removing from wishlist after sometime";
      throw err;
    }
  }
};
const sorting=async(count)=>{
  const sorted = count.trackingItem.sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );
  // for(let i of sorted)
  // {
  //   const $ = await fetchHTML(i.url)
  //   let price=$("._30jeq3").html();
  //   price=price.replace(/,/g,'').slice(price.indexOf(';')+1,).replace(/,/g,'').slice(1,);
  //   i.currentPrice=price;
  // }
  return sorted;
}
userModel.getfromOrder = async (userid) => {
  let model = await dbModel.getOrderConnection();
  console.log(userid);
  let count = await model.findOne({ userid: userid }, { trackingItem: 1, _id: 0 });
  if (!count) {
    let obj = {};
    obj.userid = userid;
    obj.trackingItem = [];
    let addorder = await model.create(obj);
    return [];
  } else {
    if (count.trackingItem.length > 0) {
      return sorting(count);
    } else return [];
  }
};

userModel.editTracking=async(prod)=>{
  let model = await dbModel.getOrderConnection();
  let updateQuan = await model.updateOne(
    { userid: prod.userid, "trackingItem._id": prod._id },
    { $set: { "trackingItem.$.expectedPrice": prod.expectedPrice } }
  );
  if (updateQuan.nModified == 0) {
    let err = new Error();
    err.status = 500;
    err.message = "Sorry!Server is busy.Please try to update quantity later";
    throw err;
  } else {
    return true;
  }
}

userModel.deleteTracking=async(obj)=>{
  let model = await dbModel.getOrderConnection();
  let getTrack = await model.updateOne(
    { userid: obj.userid },
    { $pull: { trackingItem: { _id: obj._id } } }
  );
  if (getTrack.nModified > 0) {
    let getCartDetail = await model.findOne(
      { userid: obj.userid },
      { trackingItem: 1, _id: 0 }
    );
    return sorting(getCartDetail);
  } else {
    let err = new Error();
    err.status = 501;
    err.message = "Sorry!Server is busy.Please try to remove later";
    throw err;
  }
}
module.exports = userModel;

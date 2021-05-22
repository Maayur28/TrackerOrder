const express = require("express");
const routes = express.Router();
const service = require("../services/user");
const auth = require("../utilities/auth");
const axios = require("axios");
const cheerio = require("cheerio");
const dbModel = require("../utilities/connection");
const nodemailer = require("nodemailer");
require("dotenv").config();
let trackingData;

setInterval(() => {
  trackingFun();
}, 60000);

async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      },
    });
    return cheerio.load(data);
  } catch (error) {
    console.log(error.message);
  }
}

const trackingFun = async () => {
  console.log("tracking");
  if (!trackingData) trackingData = await service.getTrackingDetail();
  if (trackingData) {
    for (let i of trackingData) {
      for (const j of i.trackingItem) {
        const $ = await fetchHTML(j.url);
        if($)
        {
        let price;
        if (j.url.includes("amazon")) {
          price = $("#priceblock_ourprice").html();
          if (price == null) price = $("#priceblock_dealprice").html();
          if (price == null) price = $("#priceblock_saleprice").html();
          if (price) {
            price = price
              .replace(/,/g, "")
              .slice(price.indexOf(";") + 1,-3);
          }
        } else {
          price = $("._30jeq3").html();
          if (price) {
            price = price
              .replace(/,/g, "")
              .slice(price.indexOf(";") + 1)
              .replace(/,/g, "")
              .slice(1);
          }
        }
        console.log(price);
        if (Number(price)) {
          let model = await dbModel.getOrderConnection();
          await model.updateOne(
            { userid: i.userid, "trackingItem._id": j._id },
            { $set: { "trackingItem.$.currentPrice": Number(price) } }
          );
          if (Number(price) < j.lowestPrice) {
            j.lowestPrice = Number(price);
            let model = await dbModel.getOrderConnection();
            await model.updateOne(
              { userid: i.userid, "trackingItem._id": j._id },
              { $set: { "trackingItem.$.lowestPrice": j.lowestPrice } }
            );
          }
          if (
            Number(price) <= j.expectedPrice &&
            j.expectedPrice != j.mailPrice
          ) {
            var transport = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.email,
                pass: process.env.password,
              },
            });
            const message = {
              from: "pricetracking28@gmail.com",
              to: i.email,
              subject: "Price Dropped!!!",
              html: `<h2>Congratulations,</h2><h3>Price has been reduced to ₹${Number(price)}</h3><h3>Item Name- ${i.name}</h3><h3>Price(when added)- ₹${j.whenAddedPrice}</h3><h3>Expected Price- ₹${j.expectedPrice}</h3><p>Please click on the button below to check out the product</p><br><a href=${j.url} style="margin-top:10px;color:white;background-color:rgb(33, 37, 41);padding:10px 20px;border-radius:50px;text-decoration:none ">CLICK ME</a><br><br><p>If this doesn't work please visit <a href="http://localhost:3333/viewtrackings">My Trackings</a></p><br><br><h3>Thank you for joining with us</h3> `,
            };
            transport.sendMail(message, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Success");
                j.mailPrice = j.expectedPrice;
                model.updateOne(
                  { userid: i.userid, "trackingItem._id": j._id },
                  { $set: { "trackingItem.$.mailPrice": j.mailPrice } }
                );
              }
            });
          }
        }
      }
      }
    }
  }
};

routes.post("/getprice", async (req, res, next) => {
  try {
    let originalPrice = await service.getPrice(req.body.url);
    res.json(originalPrice).status(200);
  } catch (error) {
    next(error);
  }
});
routes.post("/addtracker", auth, async (req, res, next) => {
  req.body.userid = req.user.userid;
  try {
    const rest = await axios.post("https://pricetrackeruser.herokuapp.com/getemail", {
      userid: req.body.userid,
    });
    req.body.email = rest.data.username;
    let totalTracking = await service.addtoTracking(req.body);
    if (totalTracking) {
      trackingData = totalTracking;
      var transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });
      const message = {
        from: "pricetracking28@gmail.com",
        to: rest.data.username,
        subject: "Item tracking detail",
        html: `<h2>Hi,</h2><h3>Your item tracking details:</h3><h4>Item Name- ${req.body.name}</h4><h4>Price(when added)- ₹${req.body.whenAddedPrice}</h4><h4>Expected Price- ₹${req.body.expectedPrice}</h4> <p>We will notify you once the price drops below the expected price</p><br><h2>Thank you for joining with us</h2> `,
      };
      transport.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else console.log("Success");
      });
      res.json({ success: true }).status(200);
    }
  } catch (error) {
    next(error);
  }
});
routes.get("/gettracker", auth, async (req, res, next) => {
  try {
    let trackerDetail = await service.getfromOrder(req.user.userid);
    res.json({ trackerDetail }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.put("/edittracker", auth, async (req, res, next) => {
  req.body.userid = req.user.userid;
  try {
    let trackerDetail = await service.editTracking(req.body);
    if (trackerDetail) res.json({ success: true }).status(200);
  } catch (error) {
    next(error);
  }
});
routes.delete("/deleteitem", auth, async (req, res, next) => {
  req.body.userid = req.user.userid;
  try {
    let trackerDetail = await service.deleteTracking(req.body);
    res.json({ trackerDetail }).status(200);
  } catch (error) {
    next(error);
  }
});
module.exports = routes;

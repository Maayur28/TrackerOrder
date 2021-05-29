const validator = require("../utilities/validate");
const model = require("../models/user");

let userService = {};

userService.getTrackingDetail = async () => {
  return await model.getTrackingDetail();
};

userService.getPrice = async (agent, url) => {
  return await model.getPrice(agent, url);
};

userService.addtoTracking = async (obj) => {
  // if (validator.addtoTracking(obj))
  if (true) return await model.addtoTracking(obj);
  else {
    let err = new Error();
    err.status = 400;
    err.message = "Item not found,Please check the item and try again";
    throw err;
  }
};
userService.getfromOrder = async (userid) => {
  // if (validator.getfromOrder(userid))
  if (true) return await model.getfromOrder(userid);
  else {
    let err = new Error();
    err.status = 400;
    err.message = "Item not found,Please check the item and try again";
    throw err;
  }
};
userService.editTracking = async (obj) => {
  return await model.editTracking(obj);
};
userService.deleteTracking = async (obj) => {
  return await model.deleteTracking(obj);
};
module.exports = userService;

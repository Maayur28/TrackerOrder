const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();

const url = process.env.URL;
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const orderprodSchema = mongoose.Schema({
  _id: { type: Number},
  url: { type: String, required: [true, "Url is required"] },
  name: { type: String, required: [true, "Name is required"] },
  whenAddedPrice: { type: Number, required: [true, "Price is required"] },
  expectedPrice: { type: Number, required: [true, "Expected Price is required"] },
  lowestPrice: { type: Number}, image: { type: String },
  image: { type: String },
  currentPrice: { type: Number},
  time:{type:Date,default:Date.now},
  mailPrice:{type:Number}
});
const orderSchema=mongoose.Schema({
  userid:{type:String,required:[true,"userid is required"]},
  email:{type:String,required:[true,'email is required']},
  trackingItem:[orderprodSchema]
})

let connection = {};
connection.getOrderConnection = async () => {
  try {
    let dbConnection = await mongoose.connect(url, options);
    let model = dbConnection.model("Tracker", orderSchema,"trackers");
    return model;
  } catch (error) {
    let err = new Error("Could not establish connection with order database");
    err.status = 500;
    throw err;
  }
};
module.exports = connection;

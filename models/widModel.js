const { Schema, model } = require("mongoose");

const SupportSchema = new Schema({
  category: { type: String, required: true },
  message: { type: String, required: true },
  userid: { type: String, required: true },
  subject: { type: String, required: true },
}, {timestamps: true});

const WithdrawSchema = new Schema({
  amount: { type: Number, required: true },
  otp: { type: Number, required: true },
  address: { type: String, default: "" },
  userid: { type: String, required: true },
  bankname: {type: String, default: ""},
  accnumber: {type: Number, default: 0},
  other: {type: String, default: ""}
}, {timestamps: true});

const Support = model("support", SupportSchema);
const Withdraw = model("withdraw", WithdrawSchema);

module.exports = { Support, Withdraw };

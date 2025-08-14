const { Schema, model } = require("mongoose");
const {isEmail} = require("validator")

const contactSchema = new Schema({
  fullname: { type: String, required: [true, "Full Name is Required"] },
  message: { type: String, required: [true, "Email Address is Required"] },
  phone: { type: String, required: [true, "Phone Number is Required"] },
  email: {
    type: String,
    unique: true,
    dropDups: true,
    required: [true, "Email Address is Required"],
    validate: {
      validator: isEmail,
      message: "Please provide a valid email",
    },
  },
  subject: { type: String, required: true },
}, {timestamps: true});


const Contact = model("contact", contactSchema);

module.exports = {Contact};

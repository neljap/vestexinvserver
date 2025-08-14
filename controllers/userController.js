const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Withdraw, Support } = require("../models/widModel");
const {testEmail} = require("../utils/sendEmail");


const signInToken = (id) => {
  return jwt.sign({ id }, "my-ultra-secure-and-ultra-long-secret", {
    expiresIn: "90d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signInToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  return res.status(statusCode).json({ token });
};

async function loginuser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // res.status(200).json({ message: "Login successful!" });
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: `Internal server error ${err}` });
  }
}

async function registeruser(req, res) {
  // console.log("Hello")
  try {
    const { fullname, password, email, number } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      fullname,
      password,
      email,
      number
    });
// const mailOptions = {
//       email,
//       subject: "Welcome to Oasis Trade Hub",
//       html: `Hello ${fullname}, <br/> <br/>
//       Welcome to Oasis Trade Hub—where smart trading, secure investments, and staking help your wealth grow faster. Kindly proceed to begin your journey toward financial growth.`
//     };



    // testEmail(mailOptions);
    res.json({
      message: "successful",
      newuser,
    });
    
  } catch (err) {
    res.status(500).json({ error: `Internal server error ${err}` });
  }
}

const getSingleUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "no user" });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (req, res) => {


  try {
    const updateUserInfo = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: updateUserInfo,
    });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.send({ message: "User does not exist" });
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    console.log("this is resetToken", resetToken);
    const resetURL = `http://localhost:3030/api/user/reset-password/${resetToken}`;

    // console.log("this is resetURL", resetURL)
    // const mailOptions = {
    //   email: user.email,
    //   subject: "Reset Your Password - Spectrum Capitals",
    //   html: `<p>Hello ${user.fullname}, Kindly Click on the link below to reset your password. <br/> <br/> ${resetURL} </p>`,
    // };

    // await testEmail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

const resetPassword = async (req, res) => {
  // console.log("token from params", req.params.token)
  // try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

      // console.log("hashed token",hashedToken)

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      // passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .send({ message: "Token is invalid or has expired" });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    try{
    await user.save();
    createSendToken(user, 200, res);  
    }catch (error) {
      res.status(500).json({ error: `Internal Server Error: ${error}` });
    }
    
  // } catch (error) {
  //   res.status(500).json({
  //     status: "fail",
  //     message: error,
  //   });
  // }
};

async function supportfunc(req, res) {
  try {
    const { category, message, userid, subject } = req.body;
    const supInfo = await Support.create({
      category,
      message,
      userid,
      subject,
    });
    res.json({
      message: "successful",
      supInfo,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
}

async function withdrawfunc(req, res) {
  try {
    const { amount, otp, address, bankname, accnumber, other, userid } = req.body;
    const wdinfo = await Withdraw.create({
      amount,
      userid,
      otp,
      address,
      bankname,
      accnumber,
      other
    });
    res.status(200).json({
      message: "successful",
      wdinfo,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
}

async function userReceipt(req, res) {
  const { userid, receipt } = req.body;
  try {
    const reseipt = await User.findOneAndUpdate(
      { _id: userid },
      { $push: { receipts: receipt } }
    );

    res.json({
      status: "success",
      reseipt,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "fail", message: `Internal Server Error: ${err}` });
  }
}

async function subscribeFunc(req, res) {
  const { userid, subscribe } = req.body;
  try {
    const resubscribe = await User.findOneAndUpdate(
      { _id: userid },
      { $push: { subscribe } }
    );

    res.json({
      status: "success",
      resubscribe,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "fail", message: `Internal Server Error: ${err}` });
  }
}

async function createContact(req, res){
    try{
        const {email, fullname, message, subject, phone} = req.body;

        const newContactInfo = await Contact.create({
            email, fullname, message, subject, phone
        })

        res.json({
            message: "successful",
            newContactInfo
        })

    }catch(error){
        res.status(500).json({error:`Internal Server Error: ${error}`})
    }
}


module.exports = {
  registeruser,
  loginuser,
  getSingleUser,
  updateUser,
  supportfunc,
  subscribeFunc,
  withdrawfunc,
  userReceipt,
  forgotPassword,
  resetPassword,
  createContact
};

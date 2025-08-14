const nodemailer = require("nodemailer");

const testEmail = async (options) => {
    try{
   // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "oasistradehub@gmail.com",
      pass: "swaeyanyczbpstaj"
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "oasistradehub@gmail.com",
    to: "ubnkantah@gmail.com",
    subject: options.subject,
    html: options.html,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);     
    }catch(error){
        console.log(error);
    }
  
};

module.exports = {testEmail};

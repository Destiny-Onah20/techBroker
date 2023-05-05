const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({path: "../config/cofig.env"});

const mailSender = async(Option)=>{
  const transport = nodemailer.createTransport({
    secure: false,
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
    const mailOption = {
      from: process.env.EMAIL,
      to: Option.email,
      subject: Option.subject,
      text: Option.message
    };
    await transport.sendMail(mailOption)
};

module.exports = mailSender;
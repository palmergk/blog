"use strict";
const nodemailer = require("nodemailer");



const sendMail = ({to:emailTo, subject: subject, html: html}) => {

  const EmailFrom = "support@secureinvest.org"
    
const transporter = nodemailer.createTransport({
    host: "mail.secureinvest.org",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: EmailFrom,
      pass: "secureinvest.org",
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: EmailFrom, // sender address
      to: emailTo, // list of receivers
      subject: subject, // Subject line
      text: "Hello world? plain text", // plain text body
      html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  main().catch(console.error);
  
}

module.exports = sendMail
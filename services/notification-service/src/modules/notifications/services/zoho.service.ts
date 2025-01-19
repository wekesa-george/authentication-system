
const nodemailer = require("nodemailer");
let ejs = require('ejs');
import { Payload } from "../../../utils/types.dt";
export async function sendMail(emailHtml: string, payload: Payload) {

let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //let htmlBody = ejs.compile(tpl, body);
  try{

    const info = await transporter.sendMail({
                              from:payload.from,
                              to:payload.to_email,
                              subject: payload.subject,
                              html: emailHtml
                            });
    return info.messageId;

  }catch(err){
        return {error:err.message};
  }
}




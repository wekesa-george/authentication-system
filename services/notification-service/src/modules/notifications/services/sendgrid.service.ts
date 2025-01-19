
const nodemailer = require("nodemailer");
let ejs = require('ejs');
import { Payload } from "../../../utils/types.dt";
export async function sendMail_SENDGRID(emailHtml: string, payload: Payload) {

let transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDGRID_EMAIL_USER,
      pass: process.env.SENDGRID_EMAIL_PASS,
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
    console.log(err);
        return {error:err.message};
  }
}




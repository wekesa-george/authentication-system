const twilio = require('twilio');
const client = new twilio(process.env.ACCOUNT_SID, process.env.ACCOUNT_TOKEN);

export async function sendSingleSms(number: string , msg: string){

  try {
    const {sid} = await client.messages.create({
      body: msg,
      to: number,
      from: process.env.TWILIO_MESSAGING_SERVICE_SID
    })
    return {single:true, sid}
  } catch (error) {
      return {error: error.message}
  }
}
export async function sendBulkSms(number:string[], msg: string){

  try {
    const message = await Promise.all(
      number.map(number => {
        return twilio.messages.create({
          to: number,
          from: process.env.TWILIO_MESSAGING_SERVICE_SID,
          body: msg
        });
      })
    )
    return {message}
  } catch (error) {
    return {error: error.message}
  }
}

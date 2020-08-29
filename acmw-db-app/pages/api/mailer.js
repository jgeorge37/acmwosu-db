// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config();

console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (email, token) => {
    const msg = {
    to: email,
    from: 'acmwosu@gmail.com',
    subject: 'ACM-W OSU Database - Reset Password',
    text: 'hellooooo, here\'s your token: ' + token
  };
  sgMail.send(msg);
}

export default (req, res) => {
  let result = '';
  try {
    const email = 'YOUR EMAIL';
    sendEmail(email, 'YOUR TOKEN');
    result = `Success - email sent to ${email}`;
  } catch (err) {
    res.statusCode = 500;
    result = `Error - ${err}`;
  }
  res.json(result);
}

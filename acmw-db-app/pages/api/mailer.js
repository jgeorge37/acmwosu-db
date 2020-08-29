// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
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

sendEmail('li.10011@osu.edu', 'cat')

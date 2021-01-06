// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generic send function for all emails
const sendEmail = (email, subject, body) => {
  const msg = {
    to: email,
    from: 'acmwosu@gmail.com',
    subject: subject,
    html: "<html><head></head><body>" + body + "</body></html>"
  };
  sgMail.send(msg).catch(err => {throw err});
}

// POST 
async function resetPassword(email, token) {
  const subject = "ACMWOSU - Reset your password";
  const message = `
    <p>Click the link below to reset your password. The link will expire in 1 hour.</p>
    <p><a href="${process.env.APP_URL}/reset?token=${token}">
      ${process.env.APP_URL}/reset?token=${token}
    </a></p>
  `;
  sendEmail(email, subject, message);
  return `Password reset email sent to ${email}`;
}

export default async (req, res) => {
  const { 
    query: { pid },
  } = req

  let result = {};

  try {
    if(req.method === 'POST'){
      const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
      switch(pid) {
        case 'reset-pw':
          if(!body.email || !body.token) throw ("Missing email and/or token in request body.");
          result = await resetPassword(body.email, body.token);
          break;
        default:
            throw("Invalid pid");
      }
    } else {
      throw("Invalid request type for mailer");
    }
    res.statusCode = 200;
  } catch(err) {
    res.statusCode = 500;
    result.error = err;
  } finally {
    res.json(result);
  }
}

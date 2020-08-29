// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();

// TESTING HEROKU DB CONNECTION
/*
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/

console.log(process.env.DATABASE_URL)

export default (req, res) => {
  client.connect();

  client.query('SELECT * FROM company;', (err, data) => {
    if (err) throw err;
    console.log(data);
    client.end();
  });
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}

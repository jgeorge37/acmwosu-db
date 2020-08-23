import pgQuery from '../../../postgres/pg-query.js';

// GET /api/account/verify
// Check for matching email and password
async function verify (email, password) {
    const data = pgQuery(`SELECT email FROM account WHERE email = '${email}' AND password = crypt('${password}', password);`);
    console.log(data);
    return data;
}

export default (req, res) => {
    const {
      query: { pid },
    } = req

    var result = ''

    if(req.method === 'POST' && pid === 'verify') {
        result = verify()
    }
  
    res.json(result);
  }
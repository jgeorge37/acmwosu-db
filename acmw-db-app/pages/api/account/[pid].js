import pgQuery from '../../../postgres/pg-query.js';

// GET /api/account/verify
// Check for matching email and password
async function verify (email, password) {
    const data = await pgQuery(`SELECT email FROM account WHERE email = '${email}' AND password = crypt('${password}', password);`);
    return data.rows;
}

export default async (req, res) => {
    const { 
      query: { pid },
    } = req

    var result = ''

    if(req.method === 'POST'){
        const body = JSON.parse(req.body);

        if(pid === 'verify') {
            result = await verify(body.email, body.password);
        }
    }
    res.json(result);
  }
import pgQuery from '../../../postgres/pg-query.js';

// GET /api/company/byString
// Given a string check for potential matching companies
async function companiesByString (input) {
    const data = await pgQuery(`SELECT c.cname, c.id FROM company c WHERE LOWER(c.cname) LIKE LOWER('%${input}%')`);
    return data.rows;
}

export default async (req, res) => {
    const { 
      query: { pid },
    } = req

    let result = {};

    try {
        if(req.method === 'GET'){
            if(pid === 'byString') {
                if(!req.query.input) throw ("Missing input query");
                result = await companiesByString(req.query.input);
            } else {
                throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for company");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
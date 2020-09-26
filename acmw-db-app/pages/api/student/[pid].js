import pgQuery from '../../../postgres/pg-query.js';

// GET /api/student/search
// Given an object, with properties named for the student columns (name_dot_num, fname, and/or lname) find matches
// This is an AND situation, not OR, so when given multiple fields, the function will only return students who %match% (where input is a substring of actual) all criteria
async function searchStudents (query) {
    const data = await pgQuery(`
        SELECT 
        id, fname, lname, name_dot_num
        FROM student
        WHERE 
        ${!!query.name_dot_num ? 
            "LOWER(name_dot_num) LIKE LOWER('%" + query.name_dot_num + "%')" : ""
        }
        ${!!query.name_dot_num && (!!query.lname || !!query.fname) ?
            " AND " : ""
        }
        ${!!query.lname ? 
            "LOWER(lname) LIKE LOWER('%" + query.lname + "%')" : ""
        }
        ${!!query.lname && !!query.fname ?
            " AND " : ""
        }
        ${!!query.fname ? 
            "LOWER(fname) LIKE LOWER('%" + query.fname + "%')" : ""
        }
    `);
    return data.rows;
}

export default async (req, res) => {
    const { 
      query: { pid },
    } = req

    let result = {};

    try {
        if(req.method === 'GET'){
            if(pid === 'search') {
                // Throw error if no valid search criteria is provided
                if(!req.query || (!req.query.name_dot_num && !req.query.lname && !req.query.fname)) {
                    throw("Missing search criteria: query must include name_dot_num, lname, and/or fname.");
                }
                result = await searchStudents(req.query);
            } else {
                throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for company");
        }
        res.statusCode = 200;
    } catch(err) {
        console.log(err)
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }

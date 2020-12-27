import pgQuery from '../../../postgres/pg-query.js';

// POST /api/attendance/record
// Create an account: email = new user's email address, password = unencrypted new password, student_id may be null
async function record (event_code, f_name, l_name_dot_num) {
    const curr_student_id = await pgQuery(`SELECT student_id FROM student WHERE name_dot_num = '${l_name_dot_num}'`);
    if(!curr_student_id.rowCount){
        // how do I create new student? should it prompt for all the extra account info?
        /*
        const data = await pgQuery(`
        INSERT INTO student (fname, lname, name_dot_num, personal_email, school_level, packet_sent_date)
        VALUES ('${fname}', '${lname}', '${name_dot_num}',
            ${personal_email ? `'${personal_email}'`: null},
            ${school_level ? `'${school_level}'`: null},
            ${packet_sent_date ? `'${packet_sent_date}'`: null})
        RETURNING id;
        `);
        */
    }
    const data = await pgQuery(`INSERT INTO meeting_student (meeting_id, student_id)
        VALUES ('${event_code}', ${curr_student_id}')`);
    return data;
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
                case 'record':
                    result = await record(body.event_code, body.f_name, body.l_name_dot_num);
                    break;
                default:
                    throw("Invalid meeting_id");
            }
        } else {
            throw("Invalid request type for attendance form");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
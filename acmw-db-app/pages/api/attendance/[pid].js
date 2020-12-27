import pgQuery from '../../../postgres/pg-query.js';

// POST /api/attendance/record
// Create an account: email = new user's email address, password = unencrypted new password, student_id may be null
async function record (event_code, f_name, l_name_dot_num, year_level) {
    const curr_student_id = await pgQuery(`SELECT student_id FROM student WHERE name_dot_num = '${l_name_dot_num}'`);
    if(!curr_student_id.rowCount){
       let l_name = l_name_dot_num.split(/\./)[0];
       const reqCreateStudent = {
         method: 'POST',
         body: JSON.stringify(
           { fname: f_name.charAt(0).toUpperCase() + f_name.slice(1).toLowerCase(), //capitalization convention
             lname: l_name.charAt(0).toUpperCase() + l_name.slice(1).toLowerCase(), //capitalization convention
             name_dot_num: l_name_dot_num.toLowerCase(),
             personal_email: "", 
             school_level: year_level,
             packet_sent_date: ""
           }
         )
       };
       // using exisiting end point to create student
       const res1 = await fetch('/api/student/create', reqCreateStudent);
       const result1 = await res1.json(); //returns the id
       curr_student_id = result1[0]["id"];
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
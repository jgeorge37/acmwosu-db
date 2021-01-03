import pgQuery from '../../../postgres/pg-query.js';
//idk I wanna do this somehow but need to export it from student? thots?
//import {createStudent} from '../student/[pid].js'; 

// POST /api/attendance/record
// Record a specific student attendance
// event_code: code for meeting, f_name: first name of student, 
// l_name_dot_num: last name and dot number of student, year_level: school level of student
async function record (event_code, f_name, l_name_dot_num, year_level) {
    const curr_student_id = await pgQuery(`SELECT id FROM student WHERE name_dot_num = '${l_name_dot_num}'`);
    //if the student doesn't exist 
    if(!curr_student_id.rowCount){
       let l_name = l_name_dot_num.split(/\./)[0];
       // creating new student if it didn't exist
       // so, right now should get
       //  error: insert or update on table "meeting_student" violates foreign key constraint "meeting_student_meeting_id_fkey"
       curr_student_id = await pgQuery(`
            INSERT INTO student (fname, lname, name_dot_num, personal_email, school_level, packet_sent_date)
                VALUES ('${f_name}', '${l_name}', '${l_name_dot_num}',
                 '${no_email}',
                 '${year_level}',
                  '${no_send_packet}')
         RETURNING id;
         `);
    }

    // assuming meeting id is present for now, so not adding it to meeting table, just straight to meeting student
    const data = await pgQuery(`INSERT INTO meeting_student (meeting_id, student_id)
        VALUES ('${event_code}', '${curr_student_id.rows[0].id}')`);
    console.log(data);
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
                    result = await record(body.event_code, body.f_name, body.l_name_dot_num, body.year_level);
                    break;
                // probs need to add more error checks in future
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
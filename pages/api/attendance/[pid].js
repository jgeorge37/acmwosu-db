import pgQuery from '../../../postgres/pg-query.js';
//idk I wanna do this somehow but need to export it from student? thots?
//import {createStudent} from '../student/[pid].js'; 

async function createStudent(fname, lname, name_dot_num, personal_email, school_level, packet_sent_date) {
    const data = await pgQuery(`
      INSERT INTO student (fname, lname, name_dot_num, personal_email, school_level, packet_sent_date)
      VALUES ('${fname}', '${lname}', '${name_dot_num}',
              ${personal_email ? `'${personal_email}'`: null},
              ${school_level ? `'${school_level}'`: null},
              ${packet_sent_date ? `'${packet_sent_date}'`: null})
      RETURNING id;
    `);
    return data;
  }

// POST /api/attendance/record
// Record a specific student attendance
// event_code: code for meeting, f_name: first name of student, 
// l_name_dot_num: last name and dot number of student, year_level: school level of student
// list_serv: boolean - student wants to be added to the newsletter
async function record (event_code, f_name, l_name_dot_num, year_level, list_serv) {
    // don't do anything if the attendance code is not valid
    // no timezone conversion since UTC = UTC
    let meetingId = await pgQuery(`SELECT id FROM meeting WHERE code='${event_code}' AND current_timestamp <= code_expiration`); 
    if(meetingId.rowCount === 0) throw (`Meeting code ${event_code} invalid or expired.`);
    meetingId = meetingId.rows[0].id;

    let curr_student_id = await pgQuery(`SELECT id FROM student WHERE name_dot_num = '${l_name_dot_num.toLowerCase()}'`);
    //if the student doesn't exist 
    if(!curr_student_id.rowCount){
        let l_name = l_name_dot_num.split(/\./)[0];
        curr_student_id = await createStudent(f_name, l_name, l_name_dot_num.toLowerCase(), "", year_level, "");
    }
    // get that id out of that object!!!
    curr_student_id = curr_student_id.rows[0].id;

    // update data if it changed
    await pgQuery(`
        UPDATE student SET
        fname = '${f_name}',
        school_level = '${year_level}'
        WHERE name_dot_num = '${l_name_dot_num.toLowerCase()}';
    `);

    try {
        await pgQuery(`
            INSERT INTO meeting_student (meeting_id, student_id, add_to_newsletter) VALUES (${meetingId}, ${curr_student_id}, ${list_serv})
        ;`);
    } catch(err) {
        if(err.code !== '23505') throw (err);  // silence duplication attendance error 
        // update add_to_newsletter
        await pgQuery(`
            UPDATE meeting_student 
            SET add_to_newsletter = '${list_serv}' 
            WHERE meeting_id = ${meetingId} AND student_id = ${curr_student_id};
        `);
    }
    return {message: "success"}
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
                    if (!body.event_code) throw ("Must provide a meeting code!");
                    if (!body.f_name) throw ("Must provide a first name!");
                    if (!body.l_name_dot_num) throw ("Must provide a last name dot number!");
                    if (!body.year_level) throw ("Must provide a school level!");
                    if (typeof body.list_serv !== 'boolean') throw ("Must provide list serv boolean");
                    result = await record(body.event_code, body.f_name, body.l_name_dot_num, body.year_level, body.list_serv);
                    break;
                // probs need to add more error checks in future
                default:
                    throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for attendance form");
        }
        res.statusCode = 200;
    } catch(err) {
        console.log(err);
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
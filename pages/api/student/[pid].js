import pgQuery from '../../../postgres/pg-query.js';
import {currentAcademicYear} from '../../../utility/utility';
import {checkAuth} from '../auth/[pid]';
import {serialize} from 'cookie';

// GET /api/student/meeting-attendees
async function getMeetingAttendees(meeting_id) {
    const data = await pgQuery(`
      SELECT id, fname, lname, name_dot_num
      FROM student
      LEFT JOIN meeting_student
      ON student.id=meeting_student.student_id
      WHERE meeting_student.meeting_id='${meeting_id}'
    `);
    return data.rows;
}

// GET /api/student/total-unique-members
async function totalUniqueMembers () {
    const [fall, spring] = currentAcademicYear();
    const data = await pgQuery(
      `SELECT COUNT(DISTINCT student_id)
      FROM meeting_student
      INNER JOIN meeting
      ON meeting_student.meeting_id=meeting.id
      WHERE (meeting.semester='${fall}' OR meeting.semester='${spring}')`
    );
    return data.rows[0]["count"] ? data.rows[0]["count"] : 0;
}

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

// GET /api/student/ghc
// Given an object, with properties named for the student columns (name_dot_num, fname, and/or lname) find matches
// This is an AND situation, not OR, so when given multiple fields, the function will only return students who %match% (where input is a substring of actual) all criteria
async function ghcStudents(query) {
  const data = await pgQuery(`
    SELECT
    student.id, student.fname, student.lname, student.name_dot_num
    FROM student
    INNER JOIN ghc
    ON ghc.student_id = student.id
    WHERE
    ${!!query.name_dot_num ?
        "LOWER(student.name_dot_num) LIKE LOWER('%" + query.name_dot_num + "%')" : ""
    }
    ${!!query.name_dot_num && (!!query.lname || !!query.fname) ?
        " AND " : ""
    }
    ${!!query.lname ?
        "LOWER(student.lname) LIKE LOWER('%" + query.lname + "%')" : ""
    }
    ${!!query.lname && !!query.fname ?
        " AND " : ""
    }
    ${!!query.fname ?
        "LOWER(student.fname) LIKE LOWER('%" + query.fname + "%')" : ""
    } 
  `);
  return data.rows;
}

// POST /api/student/create
// Creates a new student. all params after name_dot_num are optional
// Returns the id of the new student
async function createStudent(fname, lname, name_dot_num, personal_email, school_level, packet_sent_date) {
  const data = await pgQuery(`
    INSERT INTO student (fname, lname, name_dot_num, personal_email, school_level, packet_sent_date)
    VALUES ('${fname}', '${lname}', '${name_dot_num}',
            ${personal_email ? `'${personal_email}'`: null},
            ${school_level ? `'${school_level}'`: null},
            ${packet_sent_date ? `'${packet_sent_date}'`: null})
    RETURNING id;
  `);
  return data.rows
}

// POST /api/student/delete
// delete a student given student_id
async function delete_(name_dot_num) {
    const data = await pgQuery(`SELECT id FROM student WHERE name_dot_num='${name_dot_num}';`);
    if(data.rowCount === 0) throw(`Student ${name_dot_num} not found.`);
    const id = data.rows[0].id;

    // delete attendance records
    await pgQuery(`DELETE FROM meeting_student WHERE student_id=${id};`);
    // delete account
    await pgQuery(`DELETE FROM account WHERE student_id=${id};`);
    // delete ghc row
    await pgQuery(`DELETE FROM ghc WHERE student_id=${id};`);
    // delete student
    await pgQuery(`DELETE FROM student WHERE name_dot_num='${name_dot_num}';`);

    return name_dot_num + " was ejected.";
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};
    let auth_token = null;
    let user_email = null;

    try {
        if (req.method === 'GET') {
            if (pid === 'total-unique-members') { // requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                result = await totalUniqueMembers();
            } else if (pid === 'search') { // requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                // Throw error if no valid search criteria is provided
                if(!req.query || (!req.query.name_dot_num && !req.query.lname && !req.query.fname)) {
                    throw("Missing search criteria: query must include name_dot_num, lname, and/or fname.");
                }
                result = await searchStudents(req.query);
            } else if (pid === 'meeting-attendees') { // requires exec permission
              [auth_token, user_email] = await checkAuth(req, res, true);
              if (!req.query || !req.query.meeting_id) {
                throw("Missing search criteria: query must include meeting_id");
              }
              result = await getMeetingAttendees(req.query.meeting_id);
            } else if (pid === 'ghc') { // requires exec permission
              [auth_token, user_email] = await checkAuth(req, res, true);
              if (!req.query || (!req.query.name_dot_num && !req.query.lname && !req.query.fname)) {
                throw("Missing search criteria: query must include name_dot_num, lname, and/or fname.");
              }
              result = await ghcStudents(req.query);
            } else {
                throw("Invalid pid");
            }
        } else if (req.method === 'POST') { // requires exec permission
          [auth_token, user_email] = await checkAuth(req, res, true);
          const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
          switch (pid) {
            case 'create':
              if (!body.fname) throw("Missing create parameter: must include fname")
              if (!body.lname) throw("Missing create parameter: must include lname")
              if (!body.name_dot_num) throw("Missing create parameter: must include name_dot_num")
              result = await createStudent(
                body.fname,
                body.lname,
                body.name_dot_num,
                body.personal_email,
                body.school_level,
                body.packet_sent_date
              );
              break;
            case 'delete':
              if (!body.name_dot_num) throw("Missing delete parameter: must include name_dot_num")
              result = await delete_(body.name_dot_num)
              break;
            default:
              throw("Invalid pid");
          }
        } else {
            throw("Invalid request type for student");
        }
        res.statusCode = 200;
    } catch(err) {
      if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
      result.error = err;
    } finally {
      if(auth_token) res.setHeader('Set-Cookie', serialize('auth_token', user_email+":"+auth_token, { httpOnly: true, path: '/' }));
      res.json(result);
    }
  }

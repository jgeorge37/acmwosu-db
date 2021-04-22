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

// GET /api/student/list
// List students (fname, name_dot_num) and attendance information
// Paginated - uses args for limit and offset
async function list(fall, spring, limit, offset) {
  const data = {studentRows: [], totalCount: null};
  // Get data for 10 accounts
  const students = await pgQuery(`
      SELECT 
      s.id, s.fname, s.name_dot_num, 
      SUM(CASE WHEN m.semester='${fall}' THEN 1 ELSE 0 END) AS "${fall}",
      SUM(CASE WHEN m.semester='${spring}' THEN 1 ELSE 0 END) AS "${spring}"

      FROM student s 
      LEFT JOIN meeting_student ms ON s.id = ms.student_id
      INNER JOIN meeting m ON ms.meeting_id = m.id

      WHERE m.semester IN ('${fall}', '${spring}')

      GROUP BY(s.id, s.fname, s.name_dot_num)
      ORDER BY LOWER(s.name_dot_num) ASC
      LIMIT ${limit}
      OFFSET ${offset}
  ;`);

  if(students.rowCount != 0) data.studentRows = students.rows;
  // Get total number of accounts
  data.totalCount = (await pgQuery(`SELECT COUNT(*) FROM student;`)).rows[0].count;
  return data;
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
            } else if (pid === 'list') { // requires exec permission
              [auth_token, user_email] = await checkAuth(req, res, true);
              if(!req.query.offset || !req.query.limit) throw("Missing limit and/or offset in query");
              if(!req.query.spring || !req.query.fall) throw("Query requires fall and spring semester (AUxx, SPxx)");
              result = await list(req.query.fall, req.query.spring, req.query.limit, req.query.offset);
            } else {
                throw("Invalid pid");
            }
        } else if (req.method === 'POST') { // requires exec permission
          [auth_token, user_email] = await checkAuth(req, res, true);
          const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
          if (pid === 'create') {
            if (!body || !body.fname || !body.lname || !body.name_dot_num) {
              throw("Missing parameters: body must include fname, lname, and name_dot_num")
            }
            result = await createStudent(body.fname, body.lname, body.name_dot_num, body.personal_email, body.school_level, body.packet_sent_date);
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

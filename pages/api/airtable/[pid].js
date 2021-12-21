import { airtableBase, createRecord, getNewsletterOptions, getRecords, updateRecord } from './util';

const base = airtableBase();

async function getCurrentMeeting(res, code) {
  const records = await getRecords(base('Meetings'), {
    filterByFormula: `code = '${code}'`,
    view: "current_meetings"
  })
  if (records.length === 0) {
    res.statusCode = 400;
    throw new Error(`Code ${code} expired or event not found.`);
  }
  return {id: records[0].id};
}

async function attendance(meetingId, studentFields) {
  const table = base('Students');
  // standardize values
  studentFields['add_to_newsletter'] = getNewsletterOptions()[studentFields['add_to_newsletter']];
  studentFields['last_name_dot_num'] = studentFields['last_name_dot_num'].toLowerCase();
  studentFields['school_level'] = parseInt(studentFields['school_level']);

  // check if student exists
  const student_records = await getRecords(table, {
    filterByFormula: `last_name_dot_num = '${studentFields['last_name_dot_num']}'`
  })
  if (student_records.length === 0) {
    studentFields['meetings'] = [meetingId];
    await createRecord(table, studentFields);
  } else {
    const studentId = student_records[0].id;
    studentFields['meetings'] = student_records[0].fields.meetings;
    if (!studentFields['meetings'].includes(meetingId)) {
      studentFields['meetings'].push(meetingId);
    }
    await updateRecord(table, studentId, studentFields);
  }
  return {message: "success"}
}


export default async (req, res) => {
  const {
    query: { pid },
  } = req

  let result = {};

  try {
      if (req.method === 'POST') {
        const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
        if (pid === 'attendance') { 
          if (!body.meeting_record_id || !body.student) {
            throw("Missing meeting_record_id and student in request body.");
          }
          result = await attendance(body.meeting_record_id, body.student);
        } else {
          throw("Invalid pid");
        }
      } else if (req.method === 'GET') {
        if (pid === 'current-meeting') {
          if (!req.query || (!req.query.code)) {
            throw("Missing code in query.");
          }
          result = await getCurrentMeeting(res, req.query.code);
        }
      } else {
        throw("Invalid request type for airtable");
      }
      res.statusCode = 200;
  } catch(err) {
     if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
      result.error = err.message;
      console.log(err)
  } finally {
    res.json(result);
  }
}

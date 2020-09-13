import pgQuery from '../../../postgres/pg-query.js';

// GET /api/meeting/averageAttendance
async function averageAttendance () {
    var attendees = 0;
    const meetingIds = await pgQuery(`SELECT id FROM meeting`);
    for (var i = 0; i < meetingIds.rows.length; i++) {
        const data = await pgQuery(`SELECT COUNT (*) FROM meeting_student WHERE meeting_id=${meetingIds.rows[i]["id"]}`);
        attendees += parseInt(data.rows[0]["count"], 10);
    }
    return attendees/meetingIds.rows.length;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET'){
            if (pid === 'averageAttendance') {
                result = await averageAttendance();
            } else {
                throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for meeting");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }

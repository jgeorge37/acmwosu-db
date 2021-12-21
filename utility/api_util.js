const handleInitialResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error(result['error']);
    } else {
      throw new Error("Something went wrong.");
    }
  }
  return result;
}

const getMeetingIdByCode = async(code) => {
  const response = await fetch("/api/airtable/current-meeting?code=" + code, {method: "GET"});
  const result = await handleInitialResponse(response);
  return result['id'];
}

const recordAttendance = async(meetingId, studentObj) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meeting_record_id: meetingId,
      student: studentObj
    })
  };
  const response = await fetch("/api/airtable/attendance", requestOptions);
  const result = await handleInitialResponse(response);
  return result;
}

export {getMeetingIdByCode, recordAttendance}

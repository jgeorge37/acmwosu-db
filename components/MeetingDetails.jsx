import React, {useState, useRef, useEffect} from 'react'
import SelectMeeting from './SelectMeeting';
import styles from '../styles/components/MeetingDetails.module.css'

const MeetingDetails = (props) => {
  const subscribed = useRef(false)
  const [attendees, setAttendees] = useState([])
  const [meeting, setMeeting] = useState(null)

  useEffect(() => {return () => {subscribed.current = false}}, []);

  const getAttendees = async (meeting) => {
    if (meeting) {
      subscribed.current = true;
      const url = '/api/meeting/meeting-attendance?meetingId=' + meeting.value
      const response = await fetch(url, {method: 'GET'})
      response.json().then((data) => {
        if(subscribed.current) setAttendees(data)
        subscribed.current = false
      })
    }
  }

  // runs when meeting is updated
  useEffect(() => {
    getAttendees(meeting)
  }, [meeting])

  const attendanceTable = <table className={styles.md_table}>
    <tbody>
      <tr key={"header"}>
        <th>Attendee</th>
        <th>Add to newsletter</th>
      </tr>
      {attendees.map((attendee, index)=> {
        return (<tr key={index}>
          <td>{attendee.fname + " " + attendee.lname + "." + attendee.name_dot_num.split(".")[1]}</td>
          <td>{attendee.add_to_newsletter ? "Yes" : "No"}</td>
        </tr>)
      })}
    </tbody>
  </table>

  const attendanceStats = <div className={styles.md_stats}>
    <b>Attendance total</b><br/>
    <span>{meeting === null ? "N/A" : attendees ? attendees.length : 0}</span>
  </div>

  const info = <><b>Meeting info</b> <br/> 
    { meeting !== null ? (<>
      Link: {window.location.origin}/attendance?code={meeting.code} <br/>
      Code: {meeting.code} <br/>
      {meeting.expiration && <>Expiration: {meeting.expiration} <br/></>}
    </>)  
    : "N/A"}</>

  return (
    <>
      <SelectMeeting selectMeeting={setMeeting}/>
      <div className={styles.md_container}>
        <div className={styles.md_info}>
          {info}
          {attendanceStats}
        </div>
        {attendees.length > 0 && attendanceTable}
      </div>
      
    </>
  )
}

export default MeetingDetails
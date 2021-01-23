import React, {useState, useRef, useEffect} from 'react'
import SelectMeeting from './SelectMeeting';
import styles from '../styles/components/MeetingDetails.module.css'
import SubmitNotification from '../components/FormComponents/SubmitNotification'
import SubmitButton from '../components/FormComponents/SubmitButton'

const MeetingDetails = (props) => {
  const subscribed = useRef(false)
  const [attendees, setAttendees] = useState([])
  const [meeting, setMeeting] = useState(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [refresh, setRefresh] = useState(1)

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

  const deleteMeeting = async (meeting) => {
    if (meeting) {
        subscribed.current = true;
        const requestDeleteMeeting = {
            method: 'POST',
            body: JSON.stringify(
              { 
                  meeting_id: meeting.value
              }
            )
        };
        const response = await fetch('/api/meeting/delete', requestDeleteMeeting)
        if (subscribed.current) setShowNotif(true)
        subscribed.current = false;
    } 
    setAttendees([])
    setMeeting(null)
    setRefresh(null) // This is to force a refresh
    setRefresh(1)
  }
  // runs when meeting is updated
  useEffect(() => {
    getAttendees(meeting)
    setConfirmDeletion(false)
  }, [meeting])

  const meetingDelete = <div>
    {meeting && !confirmDeletion && <SubmitButton label="Delete Meeting" handleChange={() => setConfirmDeletion(true)}/>}
    {confirmDeletion && 
    <>
        <b>Are you sure you want to delete this meeting?</b><br/>
        <SubmitButton label="No" handleChange={() => setConfirmDeletion(false)}/>
        <SubmitButton label="Yes" handleChange={() => deleteMeeting(meeting)}/>
    </>}
    </div>

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
      <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/> 
      {refresh && <SelectMeeting selectMeeting={setMeeting}/>}
      
      <div className={styles.md_container}>
        <div className={styles.md_info}>
          {info}
          {attendanceStats}
          {meetingDelete}
        </div>
        {attendees.length > 0 && attendanceTable}
        
      </div>
      
    </>
  )
}

export default MeetingDetails
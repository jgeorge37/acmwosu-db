import styles from '../styles/Database.module.css'
import Head from 'next/head'
import React from 'react'
import {useState, useRef, useEffect, Fragment} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import AddAccountForm from '../components/AddAccountForm'
import TimeSelectionForm from '../components/FormComponents/TimeSelectionForm'
import DateSelectionForm from '../components/FormComponents/DateSelectionForm'
import ManageAccounts from '../components/ManageAccounts'

import SelectMeeting from '../components/SelectMeeting'
import ScholarshipReqForm from '../components/ScholarshipReqForm'
import AddMeetingForm from '../components/AddMeetingForm'
import SubmitNotification from '../components/FormComponents/SubmitNotification'


/*
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {
    const [rightPanel, setRightPanel] = useState("")
    const subscribed = useRef(false)
    const [selectedMeetingId, setSelectedMeetingId] = useState(null)
    const [confirmDeletion, setConfirmDeletion] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [refresh, setRefresh] = useState(1)

    const [time, setTime] = useState("")
    const [date, setDate] = useState("")
    const [attendees, setAttendees] = useState([])

    // prevent async update if unmounted
    useEffect(() => {return () => {subscribed.current = false}}, []);

    const recordTime = (hours, minutes, timeOfDay) => {
        // This is just for illustration purposes.
        // If you wanted to save the values, then you would save the passed in values to local variables
        if (hours.length > 0) {
            setTime(hours + ":" + minutes + " " + timeOfDay)
        } else {
            setTime("")
        }
    }

    const recordDate = (month, day, year) => {
        // This is just for illustration purposes.
        // If you wanted to save the values, then you would save the passed in values to local variables
        if (day.length > 0) {
            setDate("Month: " + month + " Day: " + day + " Year: " + year)
        } else {
            setDate("")
        }
    }

    const deleteMeeting = async (meetingId) => {
        if (meetingId) {
            subscribed.current = true;
            const requestDeleteMeeting = {
                method: 'POST',
                body: JSON.stringify(
                  { 
                      meeting_id: meetingId
                  }
                )
            };
            const response = await fetch('/api/meeting/delete', requestDeleteMeeting)
            if (subscribed.current) setShowNotif(true)
            subscribed.current = false;
        } 
        setConfirmDeletion(false)
        setSelectedMeetingId(null)
        setRefresh(null) // This is to force a refresh
        setRefresh(1)
    }

    const getAttendees = async (meeting) => {
        if (meeting) {
            subscribed.current = true;
            setSelectedMeetingId(meeting.value);
            const url = '/api/meeting/meeting-attendance?meetingId=' + meeting.value
            const response = await fetch(url, {method: 'GET'})
            response.json().then((data) => {
                const tempList = []
                for (var i in data) {
                    tempList.push(data[i]["fname"] + " " + data[i]["lname"])
                }
                if(subscribed.current) setAttendees(tempList)
                subscribed.current = false
            })
        } else {
            const tempList = ["There were no attendees at this meeting."]
            setAttendees([tempList])
        }
    }

    const menuLabels = [
        {label: "Create account", val: "accountCreate", check: () => { return rightPanel === "" || rightPanel === "accountCreate"}},
        {label: "Manage accounts", val: "manageAccounts"},
        {label: "Input GHC volunteer hours", val: "volunteer"},
        {label: "Input scholarship completion", val: "scholarship"},
        {label: "Meetings", val: "meetings"},
        {label: "Other", val: "other"}
    ]

    return (
        <div className={styles.container}>
            <Head>
                <title>Exec Page</title>
            </Head>
            <h1 className={styles.header}>Exec Dashboard</h1>
            <div className={styles.content}>
                <div className={styles.left}>
                    <ul>
                        {
                            menuLabels.map((section) => 
                            <li key={section.val}
                                className={section.check ? 
                                    (section.check() ? styles.cur_section : styles.section) :
                                    (rightPanel === section.val ? styles.cur_section : styles.section)}
                                onClick={() => setRightPanel(section.val)}
                            >
                                {section.label}
                            </li>)
                        }
                    </ul>
                </div>
                <div className={styles.right}>
                    { (rightPanel === "" || rightPanel === "accountCreate") && <AddAccountForm/> }
                    { rightPanel === "manageAccounts" && <ManageAccounts/>}
                    { rightPanel === "volunteer" &&  <GHCVolunteerForm/>}
                    { rightPanel === "scholarship" &&  <ScholarshipReqForm/>}
                    { rightPanel === "meetings" && 
                    <Fragment>
                        <h2 className={styles.header}>Add Meeting</h2>
                        <AddMeetingForm/>
                        <br></br>
                        <h2 className={styles.header}>View Meeting Attendance</h2>
                        <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/> 
                        {refresh && <SelectMeeting selectMeeting={getAttendees}/>}
                        {selectedMeetingId && <SubmitButton label="Delete Meeting" handleChange={() => setConfirmDeletion(true)}/>}
                        {confirmDeletion && 
                        <Fragment>
                            <h3>Are you sure you want to delete this meeting?</h3>
                            <SubmitButton label="No" handleChange={() => setConfirmDeletion(false)}/>
                            <SubmitButton label="Yes" handleChange={() => deleteMeeting(selectedMeetingId)}/>
                        </Fragment>
                        }                        
                        {attendees.length > 0 && <table className={styles.table}>
                            <tbody>
                                <tr key={"header"}>
                                    <th>Attendance</th>
                                </tr>
                                {attendees.map((attendee, index)=> {
                                    return (<tr key={index}><td key={index}>{attendee}</td></tr>)
                                })}
                            </tbody>
                        </table>
                        }
                    </Fragment>  
                    }
                    { rightPanel === "other" &&
                    <Fragment>
                        <DateSelectionForm recordDate={recordDate}/>
                        <p>{date}</p>
                        <TimeSelectionForm recordTime={recordTime}/>
                        <p>{time}</p>
                    </Fragment>
                    }
                </div>
            </div>
        </div>
    )
}

export default ExecDashboard

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

const ExecDashboard = () => {
    const [rightPanel, setRightPanel] = useState("")
    const subscribed = useRef(false)

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
                        <SelectMeeting selectMeeting={getAttendees}/>
                        {attendees.length > 0 && <table className={styles.table}>
                            <tbody>
                                <tr key={"header"}>
                                    <th>Attendance</th>
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

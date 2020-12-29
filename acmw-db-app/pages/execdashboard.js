import styles from '../styles/Database.module.css'
import Head from 'next/head'
import {useState, useRef, useEffect, Fragment} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import AddAccountForm from '../components/AddAccountForm'
import TimeSelectionForm from '../components/FormComponents/TimeSelectionForm'
import DateSelectionForm from '../components/FormComponents/DateSelectionForm'

import SelectMeeting from '../components/SelectMeeting'
import ScholarshipReqForm from '../components/ScholarshipReqForm'
import AddMeetingForm from '../components/AddMeetingForm'


/*
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {
    const [rightPanel, setRightPanel] = useState("")

    const subscribed = useRef(false)
    const [showGHCForm, setShowGHCForm] = useState(false)
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [showScholarshipReqForm, setShowScholarshipReqForm] = useState(false)
    const [showMeetingForm, setShowMeetingForm] = useState(false)

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
        {label: "Input GHC volunteer hours", val: "volunteer"},
        {label: "Submit scholarship completion", val: "scholarship"},
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

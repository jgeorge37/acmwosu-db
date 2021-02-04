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
import MeetingDetails from '../components/MeetingDetails'
import ScholarshipReqForm from '../components/ScholarshipReqForm'
import AddMeetingForm from '../components/AddMeetingForm'
import SubmitNotification from '../components/FormComponents/SubmitNotification'

const ExecDashboard = () => {
    const [rightPanel, setRightPanel] = useState("")
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")

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
                        <h2 className={styles.header}>View Meeting Details</h2>
                        <MeetingDetails/>
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

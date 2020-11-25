import styles from '../styles/Database.module.css'
import NavBar from '../components/NavBar'
import Head from 'next/head'
import {useState} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import AddAccountForm from '../components/AddAccountForm'
import TimeSelectionForm from '../components/FormComponents/TimeSelectionForm'
import DateSelectionForm from '../components/FormComponents/DateSelectionForm'
import ScholarshipReqForm from '../components/ScholarshipReqForm'
import SelectMeeting from '../components/SelectMeeting'

/*
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {

    const [showGHCForm, setShowGHCForm] = useState(false)
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [showScholarshipReqForm, setShowScholarshipReqForm] = useState(false)
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

    return (
        <div className={styles.container}>
            <Head>
                <title>Exec Page</title>
            </Head>
            <h1 className={styles.header}>Exec Dashboard</h1>
            <main className={styles.main}>
                <SubmitButton label="Update GHC Volunteer Hours" handleChange={() => {setShowGHCForm(true)}}/>
                {showGHCForm && <GHCVolunteerForm closeForm={() => {setShowGHCForm(false)}}/>}
                <SubmitButton label="Create Account" handleChange={() => {setShowAddAccountForm(true)}}/>
                {showAddAccountForm && <AddAccountForm closeForm={() => {setShowAddAccountForm(false)}}/>}
                <SubmitButton label="Add Scholarship Req" handleChange={() =>{setShowScholarshipReqForm(true)}}/>
                {showScholarshipReqForm && <ScholarshipReqForm handleCancel={() => {setShowScholarshipReqForm(false)}}/>}
                <DateSelectionForm recordDate={recordDate}/>
                <p>{date}</p>
                <TimeSelectionForm recordTime={recordTime}/>
                <p>{time}</p>
                <SelectMeeting />
            </main>
        </div>
    )
}

export default ExecDashboard

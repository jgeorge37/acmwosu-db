import styles from '../styles/Database.module.css'
import NavBar from '../components/NavBar'
import Head from 'next/head'
import {useState} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import StudentSearch from '../components/FormComponents/StudentSearch'
import TimeSelectionForm from '../components/FormComponents/TimeSelectionForm'

/* 
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {

    const [showGHCForm, setShowGHCForm] = useState(false)
    const [time, setTime] = useState("")


    const recordTime = (hours, minutes, timeOfDay) => {
        // This is just for illustration purposes.
        // If you wanted to save the values, then you would save the passed in values to local variables
        if (hours.length > 0) {
            setTime(hours + ":" + minutes + " " + timeOfDay)
        } else {
            setTime("")
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
                <StudentSearch />
                <TimeSelectionForm recordTime={recordTime}/>
                <p>{time}</p>
            </main>
        </div>
    )
}

export default ExecDashboard
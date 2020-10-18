import styles from '../styles/Database.module.css'
import NavBar from '../components/NavBar'
import Head from 'next/head'
import {useState} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import StudentSearch from '../components/FormComponents/StudentSearch'

/* 
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {

    const [showGHCForm, setShowGHCForm] = useState(false)

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
            </main>
        </div>
    )
}

export default ExecDashboard
import styles from '../styles/Database.module.css'
import NavBar from '../components/NavBar'
import Head from 'next/head'
import {useState} from 'react'
import SubmitButton from '../components/FormComponents/SubmitButton'
import GHCVolunteerForm from '../components/GHCVolunteerForm'
import AddAccountForm from '../components/AddAccountForm'
import StudentSearch from '../components/FormComponents/StudentSearch'

/*
    Sara: I think this page could be used for any updates/modifications exec board members would
    need to do regarding member data. Maybe have a link from this page to the database pages??
*/

const ExecDashboard = () => {

    const [showGHCForm, setShowGHCForm] = useState(false)
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState()

    const selectStudent = (student) => {
        const regex = new RegExp(/([a-z]+) [a-z]+ - ([a-z]+\.[1-9][0-9]*) \(([1-9][0-9]*)\)/i)
        //result[0] = fname, result[1] = lname dot num, result[2] = id ; or ABSOLUTE GARBAGE!
        console.log(student)
        let result = student ? student.match(regex).slice(1,4) : null
        setSelectedStudent(result)
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
                <StudentSearch selectStudent={student => selectStudent(student)}/>
                <SubmitButton label={selectedStudent ? "Create Account for This Student" : "Create Student and Account"} handleChange={() => {setShowAddAccountForm(true)}}/>
                {showAddAccountForm && <AddAccountForm autofill={selectedStudent} closeForm={() => {setShowAddAccountForm(false)}}/>}
            </main>
        </div>
    )
}

export default ExecDashboard

import SelectInput from '../components/FormComponents/SelectInput'
import TextField from '../components/FormComponents/TextField'
import SubmitButton from '../components/FormComponents/SubmitButton'
import styles from '../styles/components/AttendanceForm.module.css'
import {useState} from 'react'
import Head from 'next/head'

const AttendanceForm = (props) => {

    const [eventCode, setEventCode] = useState("")

    const yearOptions = ["First", "Second", "Third", "Fourth", "Fifth+", "Graduate or Phd student :)"]
    const listServOptions = ["I am already on the list :)", "Yes, please!", "Nope, thank you"]

    const handleSubmit = () => {
        // If event code is valid, add a database entry, and display "Submitted successfully" message
        // Else if the event code is not valid, display "Invalid event code" message

        // This would be changed to pull from a database of event codes and see if there is a match (maybe?)
        if (eventCode === "007") {
            console.log("Success!")
        } else {
            console.log("Failure!")
        }
    }

    // Sara: Actually this form might be slightly different depending on how the website is set up.
    // If ACM-W users are able to login to their personal accounts, then we would just need the event code.
    // This is just going off of past attendance forms.

    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Attendance Form</title>
            </Head>
            <div className={styles.card}>
                <h1>Attendance Form</h1>
                <p>Thank you for attending an ACM-W event! Please fill out this form to record your attendance!</p>
                <h2>Event Information</h2>
                <TextField label="Event Code" onChange={(event) => setEventCode(event.target.value)}/>
                <TextField label="First Name"/>
                <TextField label="Last Name.#"/>
                <div>
                    <h2>What year are you in?</h2>
                    <SelectInput options={yearOptions}/>
                </div>
                <div>
                    <h2>Would you like to be included in our list-serv?</h2>
                    <SelectInput options={listServOptions}/>
                </div>
                <span>
                    <SubmitButton label="Submit" handleChange={handleSubmit}/>
                </span>
            </div>
        </div>
    )
}

export default AttendanceForm
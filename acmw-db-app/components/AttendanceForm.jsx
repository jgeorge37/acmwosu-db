import SelectInput from '../components/FormComponents/SelectInput'
import TextField from '../components/FormComponents/TextField'
import SubmitButton from '../components/FormComponents/SubmitButton'
import styles from '../styles/components/AttendanceForm.module.css'
import Head from 'next/head'

const AttendanceForm = (props) => {

    const yearOptions = ["First", "Second", "Third", "Fourth", "Fifth+", "Graduate or Phd student :)"]
    const listServOptions = ["I am already on the list :)", "Yes, please!", "Nope, thank you"]

    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Attendance Form</title>
            </Head>
            <div className={styles.card}>
                <h1>Attendance Form</h1>
                <body>Thank you for attending an ACM-W event! Please fill out this form to record your attendance!</body>
                <h2>Event Information</h2>
                <TextField label="Event Code"/>
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
                    <SubmitButton label="Submit" />
                </span>
            </div>
        </div>
    )
}

export default AttendanceForm
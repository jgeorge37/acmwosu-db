import styles from '../styles/components/Form.module.css'
import DateSelectionForm from './FormComponents/DateSelectionForm'
import SelectInput from './FormComponents/SelectInput'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import TimeSelectionForm from './FormComponents/TimeSelectionForm'
import {useEffect, useRef, useState} from 'react'
import CompanySearchInput from './FormComponents/CompanySearchInput'
import SubmitNotification from './FormComponents/SubmitNotification'
import {adaFetch} from '../utility/fetch'

const AddCompanyForm = (props) => {

    const subscribed = useRef(false)
    const meetingName = useRef("")
    const semester = useRef("")
    const date = useRef({
        month: null,
        day: null,
        year: null,
    })
    const time = useRef({
        hours: null,
        minutes: null,
        timeOfDay: null
    })

    const companyOptions = [{label: "No"}, {label: "Yes"}]
    const [companyMeeting, setCompanyMeeting] = useState(false)
    const company = useRef({
        name: null,
        id: null
    })

    const [meetingError, setMeetingError] = useState("")
    const [semesterError, setSemesterError] = useState("")
    const [dateError, setDateError] = useState("")
    const [timeError, setTimeError] = useState("")
    const [companyError, setCompanyError] = useState("")
    const [code, setCode] = useState("")
    const [showNotif, setShowNotif] = useState(false)

    useEffect(() => {return () => {subscribed.current = false}}, [])

    const createMeeting = async () => {
        subscribed.current = true;
        const dateAndTime = new Date(date.current.month + " " + date.current.day + ", " + date.current.year + " " +
        time.current.hours + ":" + time.current.minutes + ":00 " + time.current.timeOfDay)
        const requestOptionsMeeting = {
            method: 'POST',
            body: JSON.stringify(
              { 
                  meeting_name: meetingName.current,
                  meeting_date: dateAndTime,
                  semester: semester.current,
                  company_id: company.current.id
              }
            )
        };
        const result = await adaFetch('/api/meeting/create', requestOptionsMeeting)
        if (subscribed.current) setCode(result["code"])
        if (subscribed.current) setShowNotif(true)
        subscribed.current = false;
    }

    const handleChange = () => {
        resetAllErrors()
        if (meetingName.current && semester.current && date.current.day && time.current.hours) {
            if (companyMeeting && !company.current.name) {
                // Company meeting was selected but no companies were found
                setCompanyError("Must select a valid company or have the meeting not be associated with a company.")
            } else {
                createMeeting()
            }
        }
        if (!meetingName.current) {
            setMeetingError("Meeting name must not be blank!")
        }
        if (!semester.current) {
            setSemesterError("Semester must not be blank!")
        }
        if (!date.current.day) {
            setDateError("Date must be completed!")
        }
        if (!time.current.hours) {
            setTimeError("Time must be completed!")
        }
    }

    const resetAllErrors = () => {
        setCompanyError("")
        setMeetingError("")
        setSemesterError("")
        setDateError("")
        setTimeError("")
    }

    const checkSemester = (event) => {
        const semesterFormat = new RegExp(/^(SP|AU)[0-9][0-9]$/)
        if (semesterFormat.test(event.target.value)) {
            setSemesterError("")
            semester.current = event.target.value
        } else {
            console.log(false)
            semester.current = null
            setSemesterError("Semester must be in the form of AUXX or SPXX where XX are numbers!")
        }

    }

    const recordDate = (month1, day1, year1) => {
        if (day1.length > 0 && year1.length > 0) {
            date.current = {
                month: month1,
                day: day1,
                year: year1,
            }
        } else {
            date.current = {
                month: null,
                day: null,
                year: null,
            }
        }
    }

    const recordTime = (hours1, minutes1, timeOfDay1) => {
        if (hours1.length > 0 && minutes1.length > 0) {
            time.current = {
                hours: hours1,
                minutes: minutes1,
                timeOfDay: timeOfDay1
            }
        } else {
            time.current = {
                hours: null,
                minutes: null,
                timeOfDay: null
            }
        }
    }

    const recordCompanyMeeting = (option) => {
        setCompanyMeeting(option.label == "Yes")
        if (option.label == "No") {
            company.current = {
                name: null,
                id: null
            }
        }
    }

    const recordCompanyInfo = (companyInfo) => {
        company.current = {
            name: companyInfo.label,
            id: companyInfo.value
        }
    }

    return (
        <div>
            <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/> 
            {!code ? 
                // If there is no code then show meeting form
                <div className={styles.popup_inner}>
                    <div>
                        <TextField label="Meeting Name" onChange={(event) => {meetingName.current = event.target.value}} error={meetingError}/>
                        <TextField label="Semester" onChange={checkSemester} error={semesterError}/>
                        <DateSelectionForm recordDate={recordDate}/>
                        <p className={styles.error}>{dateError}</p>
                        <TimeSelectionForm recordTime={recordTime}/>
                        <p className={styles.error}>{timeError}</p>
                        <SelectInput options={companyOptions} label={"Is this a company meeting?"} onChange={recordCompanyMeeting}/>
                        {companyMeeting && <CompanySearchInput onChange={recordCompanyInfo}/>}
                        <p className={styles.error}>{companyError}</p>
                    </div>
                    <div>
                        <SubmitButton label="Apply" handleChange={handleChange}/>
                    </div>                
                </div>        
                : // If there is a code then show code
                <div className={styles.popup_inner}>
                    <h2>The meeting code is: {code}</h2>
                </div>}
        </div>
    )
}

export default AddCompanyForm
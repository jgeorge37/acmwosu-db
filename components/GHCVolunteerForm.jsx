import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import SubmitNotification from './FormComponents/SubmitNotification'
import styles from '../styles/components/Form.module.css'
import {useState, useRef, useEffect} from 'react'
import {validateNumVolHours} from '../utility/utility'
import React from 'react'
import StudentSearch from './FormComponents/StudentSearch'

const GHCVolunteerForm = (props) => {

    const subscribed = useRef(false)
    const ghcStudent = useState(null)
    const volunteerEventName = useRef("")
    const numHours = useRef(0)
    const [hourError, setHourError] = useState("")
    const [eventError, setEventError] = useState("")
    const [showNotif, setShowNotif] = useState(false);

    useEffect(() => {return () => {subscribed.current = false}}, [])

    const addVolunteerHours = async () => {
        subscribed.current = true;
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(
              { 
                  student_id: ghcStudent.current.student_id,
                  hours: numHours.current,
                  source: volunteerEventName.current,
              }
            )
        };
        await fetch('/api/ghc/record-volunteer-hours', requestOptions)
        if (subscribed.current) setShowNotif(true)
        subscribed.current = false;
    }

    const onSubmit = () => {
        if (volunteerEventName.current == "" && numHours.current == 0) {
            setEventError("Event name must not be blank!")
            setHourError("Must provide a number greater than 0!")
        } else if (volunteerEventName.current == "") {
            setEventError("Event name must not be blank!")
            setHourError("")
        } else if (numHours.current == 0) {
            setEventError("")
            setHourError("Must provide a number greater than 0!")
        } else {
            addVolunteerHours()
            setShowNotif(true);
        }
    }

    const validateHours = (value) => {
        if (validateNumVolHours(value)) {
            setHourError("")
            numHours.current = value;
            console.log(value)
        } else {
            setHourError("Must be a number between 1-99")
        }
    }

    return (
        <div className={styles.popup_inner}>   
            <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/>             
            <form className={styles.form}>
                <h2>Volunteer Hour Update Form</h2>
                <div>                        
                <StudentSearch
                        selectStudent={student => {ghcStudent.current = student}} 
                        ghcFlag={true}/>
                </div>
                <div>
                    <TextField label="Volunteer Event Name" error={eventError} onChange={(event) => {volunteerEventName.current = event.target.value}}/>
                    <TextField label="Number of Hours" error={hourError} onChange={(event) => validateHours(event.target.value)}/>
                </div>                    
            </form>
            <span className={styles.buttons}>
                <SubmitButton label="Apply" handleChange={onSubmit} />
            </span>
        </div>
    )
}

export default GHCVolunteerForm

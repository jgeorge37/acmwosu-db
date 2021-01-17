import styles from '../../styles/components/FormComponents.module.css'
import {useState, useRef} from 'react'
import {validateTime} from '../../utility/utility';
import React from 'react'

/*
    In order to properly record the time from the parent component, you'll need to pass in a recordTime function.
    This should take in three parameters, so recordTime(hours, minutes, timeOfDay).
    In the parent component you can then access the parameters that are passed in.

    <TimeSelectionForm recordTime={recordTime} />

*/

const TimeSelectionForm = (props) => {

    const hours = useRef("")
    const minutes = useRef("")
    const timeOfDay = useRef("AM")

    const hoursSet = useRef(false)
    const minutesSet = useRef(false)

    const [hoursError, setHoursError] = useState("")
    const [minutesError, setMinutesError] = useState("")

    const logTime = () => {
        if (minutesSet.current && hoursSet.current) {
            props.recordTime(hours.current, minutes.current, timeOfDay.current)
        } else {
            props.recordTime("", "", "") // clear time
        }
    }

    const checkHours = (event) => {
        if (validateTime(event.target.value, "hour")) {
            hours.current = event.target.value
            hoursSet.current = true
            setHoursError("")
        } else {
            hoursSet.current = false
            hours.current = ""
            setHoursError("Must enter a number 1 - 12!")
        }

        logTime()
    }

    const checkMinutes = (event) => {
        if (validateTime(event.target.value, "minute")) {
            minutes.current = event.target.value
            minutesSet.current = true
            setMinutesError("")
        } else {
            minutesSet.current = false
            minutes.current = ""
            setMinutesError("Must be in the format 00 to 59")
        }

        logTime()
    }

    const setTimeOfDay = (event) => {
        timeOfDay.current = event.target.value
        logTime()
    }

    return (
        <div>
            <label className={styles.label}>Set Time</label>
            <div>
                <input type="text" onChange={checkHours} className={styles.hours}></input>
                <label> : </label>
                <input type="text" onChange={checkMinutes} className={styles.minutes}></input>
                <select className={styles.set} onChange={setTimeOfDay}>
                    <option>AM</option>
                    <option>PM</option>
                </select>
                <p className={styles.error}>{hoursError}</p>
                <p className={styles.error}>{minutesError}</p>

            </div>
        </div>
    )
}

export default TimeSelectionForm

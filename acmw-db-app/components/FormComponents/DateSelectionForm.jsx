import styles from '../../styles/components/FormComponents.module.css'
import SelectInput from '../FormComponents/SelectInput'
import {useState, useRef} from 'react'
import {validateTime} from '../../utility/utility';

/*
    In order to properly record the time from the parent component, you'll need to pass in a recordDate function.
    This should take in three parameters, so recordDate(month, day, year).
    In the parent component you can then access the parameters that are passed in.

    <DateSelectionForm recordDate={recordDate} />

*/

const DateSelectionForm = (props) => {

    const month = useRef("January")
    const day = useRef("")
    const year = useRef("")

    const daySet = useRef(false)
    const yearSet = useRef(false)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const thirtyMonths = ["April", "June", "September", "November"]

    const [dayError, setDayError] = useState("")
    const [yearError, setYearError] = useState("")

    const logTime = () => {
        if (daySet.current && yearSet.current) {
            props.recordDate(month.current, day.current, year.current)
        } else {
            props.recordDate("", "", "") // clear date
        }
    }

    const checkLeapYear = (year) => {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
    }

    const checkDay = (event) => {
        if (validateTime(event.target.value, "day")) {
            day.current = event.target.value
            if (thirtyMonths.includes(month.current) && (event.target.value > 30)) {
                setDayError(month.current + " only has 30 days!")
                daySet.current = false
            } else if (month.current == "February" && year.current != "" && checkLeapYear(parseInt(year.current)) && (event.target.value > 29)) {
                setDayError("February only has 29 days!")
                daySet.current = false
            } else if (month.current == "February" && (event.target.value > 28)) {
                setDayError("February only has 28 days!")
                daySet.current = false
            } else {
                daySet.current = true
                setDayError("")
            }
        } else {
            daySet.current = false
            day.current = ""
            setDayError("Must enter a number 1 - 31!")
        }
        logTime()
    }

    const checkYear = (event) => {

        if (validateTime(event.target.value, "year")) {
            year.current = event.target.value
            yearSet.current = true
            setYearError("")
            if (month.current == "February" && year.current != "" && checkLeapYear(parseInt(year.current)) && (day.current > 29)) {
                setDayError("February only has 29 days!")
                daySet.current = false
            } else {
                setDayError("")
                daySet.current = true
            }
        } else {
            yearSet.current = false
            year.current = ""
            setYearError("Must be four numbers with no leading zeroes!")
        }
        logTime()
    }

    const setMonth = (option) => {
        month.current = option.label
        if (thirtyMonths.includes(month.current) && (day.current > 30)) {
            setDayError(month.current + " only has 30 days!")
            daySet.current = false
        } else if (month.current == "February" && year.current != "" && checkLeapYear(parseInt(year.current)) && (day.current > 29)) {
            setDayError("February only has 29 days!")
            daySet.current = false
        } else if (month.current == "February" && (day.current > 28)) {
            setDayError("February only has 28 days!")
            daySet.current = false
        } else {
            setDayError("")
            daySet.current = true
        }
        logTime()
    }

    return (
        <div>
            <label className={styles.label}>Set Date</label>
            <div>
                <SelectInput options={months.map((m) => ({label: m}))} onChange={setMonth}/>
                <label> Day </label>
                <input type="text" onChange={checkDay} className={styles.hours}></input>
                <label> Year </label>
                <input type="text" onChange={checkYear} className={styles.minutes}></input>
                <p className={styles.error}>{dayError}</p>
                <p className={styles.error}>{yearError}</p>
            </div>
        </div>
    )
}

export default DateSelectionForm

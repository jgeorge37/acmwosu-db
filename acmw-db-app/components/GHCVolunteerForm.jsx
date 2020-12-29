import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import SubmitNotification from './FormComponents/SubmitNotification'
import styles from '../styles/components/Form.module.css'
import {useState} from 'react'
import {validateNumber} from '../pages/api/utility'

const GHCVolunteerForm = (props) => {

    // eventually connect this to actual GHC scholarship awardees from database
    // Can implement a search similar to "company search component" but for members
    const GHCNames = [
        {label: "Milly Mason"},
        {label: "Jing George"},
        {label: "Angela Li"},
        {label: "Morgan Zahner"},
        {label: "Sara Miskus"},
        {label: "Amy Huang"}
    ];

    const [GHCName, setGHCName] = useState("")
    const [volunteerEventName, setVolunteerEventName] = useState("")
    const [numHours, setNumHours] = useState(0)
    const [hourError, setHourError] = useState("")
    const [eventError, setEventError] = useState("")
    const [showNotif, setShowNotif] = useState(false);

    const onSubmit = () => {
        if (volunteerEventName == "" && numHours == 0) {
            setEventError("Event name must not be blank!")
            setHourError("Must provide a number greater than 0!")
        } else if (volunteerEventName == "") {
            setEventError("Event name must not be blank!")
            setHourError("")
        } else if (numHours == 0) {
            setEventError("")
            setHourError("Must provide a number greater than 0!")
        } else {
            // do api call to POST data
            setShowNotif(true);
        }
    }

    const validateHours = (value) => {
        if (validateNumber(value)) {
            setHourError("")
            setNumHours(value)
            console.log(value)
        } else {
            setHourError("Must be a number!")
        }
    }

    return (
        <div className={styles.popup_inner}>   
            <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/>             
            <form className={styles.form}>
                <h2>Volunteer Hour Update Form</h2>
                <div>                        
                    <SelectInput label={"Update volunteer hours for: "} options={GHCNames} onChange={(option) => setGHCName(option.label)}/>
                </div>
                <div>
                    <TextField label="Volunteer Event Name" error={eventError} onChange={(event) => setVolunteerEventName(event.target.value)}/>
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

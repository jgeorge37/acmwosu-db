import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import MultiSelectInput from './FormComponents/MultiSelectInput'
import styles from '../styles/components/CompanyForm.module.css'
import {useState} from 'react'

const GHCVolunteerForm = (props) => {

    // eventually connect this to actual GHC scholarship awardees from database
    // Can implement a search similar to "company search component" but for members
    const GHCNames = ["Milly Mason", "Jing George", "Angela Li", "Morgan Zahner", "Sara Miskus", "Amy Huang"]

    const [GHCName, setGHCName] = useState("")
    const [volunteerEventName, setVolunteerEventName] = useState("")
    const [numHours, setNumHours] = useState(0)
    const [hourError, setHourError] = useState("")

    const onSubmit = () => {
        // replace later with an api call to POST data
        
    }

    const validateHours = (value) => {
        const regex = new RegExp("^([1-9][0-9]{0,1})$")
        if (regex.test(value)) {
            setHourError("")
            setNumHours(value)
            console.log(value)
        } else {
            setHourError("Must be a number!")
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>                
                <form className={styles.form}>
                    <h2>Volunteer Hour Update Form</h2>
                    <div>                        
                        <SelectInput label={"Update volunteer hours for: "} options={GHCNames} onChange={(event) => setGHCName(event.target.value)}/>
                    </div>
                    <div>
                        <TextField label="Volunteer Event Name" onChange={(event) => setVolunteerEventName(event.target.value)}/>
                        <TextField label="Number of Hours" error={hourError} onChange={(event) => validateHours(event.target.value)}/>
                    </div>
                    <div>
                        <SubmitButton label="Apply" handleChange={onSubmit} />
                        <SubmitButton label="Cancel" handleChange={props.closeForm} />
                    </div>
                </form>
            </div>
     </div>
    )
}

export default GHCVolunteerForm
import styles from '../styles/components/Form.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import CompanySearchInput from './FormComponents/CompanySearchInput'

const AddContactForm = (props) => {

    const handleChange = () => {
        console.log("Added contact successfully!")
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Add Contact Information</h2>
                    <CompanySearchInput />
                    <div>
                        <TextField label="First Name"/>
                        <TextField label="Last Name"/>
                        <TextField label="Email"/>
                        <TextField label="Mailing Address"/>
                    </div>
                    <div>
                        <SubmitButton label="Apply" handleChange={handleChange} />
                        <SubmitButton label="Cancel" handleChange={props.closeForm} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddContactForm

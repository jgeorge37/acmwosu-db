import styles from '../styles/components/CompanyForm.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'

const AddCompanyForm = (props) => {

    const handleChange = () => {
        console.log("Added company successfully!")
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Add Company Information</h2>
                    <div>
                        <TextField label="Company Name"/>
                    </div>
                    <h2>Add Contact Information</h2>
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

export default AddCompanyForm

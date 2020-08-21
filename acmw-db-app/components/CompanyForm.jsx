import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import MultiSelectInput from './FormComponents/MultiSelectInput'
import styles from '../styles/components/CompanyForm.module.css'

const CompanyForm = (props) => {

    const handleChange = () => {
        console.log("Hello!")
    }

    const tempOptions = ["Company Name A-Z", "Contact Name A-Z", "Number of Contacts", "Date of Sponsorship Packet"]
    const temp2Options = ["Company Name", "Contact Name", "Contact Email", "Date Sent"]

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <div>
                        <h2>Sort By: </h2>
                        <SelectInput options={tempOptions} />
                    </div>
                    <div>
                        <h2>Filter By: </h2>
                        <MultiSelectInput options={temp2Options} />
                    </div>
                    <div>
                        <h2>Search By: </h2>
                        <div className={styles.one}>
                            <TextField label="Company Name"/>
                        </div>
                        <div className={styles.two}>
                        <TextField label="Contact Name"/>
                        </div>
                    </div>
                    <div>
                        <SubmitButton label="Apply" handleChange={handleChange} />
                        <SubmitButton label="Close" handleChange={props.closeForm} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanyForm
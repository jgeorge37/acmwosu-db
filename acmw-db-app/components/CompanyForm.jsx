import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import MultiSelectInput from './FormComponents/MultiSelectInput'
import styles from '../styles/components/CompanyForm.module.css'
import CompanySearchInput from './FormComponents/CompanySearchInput'

const CompanyForm = (props) => {

    const handleChange = () => {
        console.log("Hello!")
    }

    const handleMultiSelect = (event) => {
        console.log(event.target.value)
    }

    const tempOptions = [
        {label: "Company Name A-Z"},
        {label: "Contact Name A-Z"}, 
        {label: "Number of Contacts"}, 
        {label: "Date of Sponsorship Packet"}
    ];
    const temp2Options = ["Company Name", "Contact Name", "Contact Email", "Date Sent"]

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <div>
                        <h2>Sort By: </h2>
                        <SelectInput options={tempOptions} onChange={(option) => {console.log(option)}}/>
                    </div>
                    <div>
                        <h2>Filter By: </h2>
                        <MultiSelectInput options={temp2Options} />
                    </div>
                    <div>
                        <h2>Search By: </h2>
                        <div className={styles.one}>
                            <CompanySearchInput handleMultiSelect={handleMultiSelect}/>
                        </div>
                        <div className={styles.two}>
                            <TextField label="Contact Name"/>
                        </div>
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

export default CompanyForm

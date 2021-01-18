import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import MultiSelectInput from './FormComponents/MultiSelectInput'
import styles from '../styles/components/Form.module.css'
import React from 'react'

const SponsorshipForm = (props) => {

    const handleChange = () => {
        console.log("Hello!")
    }

    // I think this could be expanded out some more once we get the databases finished

    const tempOptions = ["Most recent sponsorship date", "Least recent sponsorship date"]
    const temp2Options = ["All sponsors", "2019-2020 Sponsors", "2018-2019 Sponsors"]

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <div>
                        <h2>Sort by: </h2>
                        <SelectInput options={tempOptions.map((value) => {label: value})} onChange={(opt) => console.log(opt)}/>
                    </div>
                    <div>
                        <h2>Show: </h2>
                        <MultiSelectInput options={temp2Options} />
                    </div>
                    <div>
                        <h2>Search for Company Sponsor: </h2>
                        <div>
                            <TextField label="Company Name"/>
                        </div>
                    </div>
                    <div>
                        <SubmitButton label="Apply" handleChange={handleChange} />
                        <SubmitButton label="Cancel" handleChange={props.handleCancel} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SponsorshipForm

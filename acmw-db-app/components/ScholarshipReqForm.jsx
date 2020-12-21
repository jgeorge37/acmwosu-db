import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import StudentSearch from './FormComponents/StudentSearch'
import styles from '../styles/components/CompanyForm.module.css'
import {useState, useRef} from 'react'

const ScholarshipReqForm = (props) => {

    const [fNameError, setfNameError] = useState("")
    const [lNameError, setlNameError] = useState("")

    const [formError, setFormError] = useState("")

    const studentLName = useRef("")
    const studentFName = useRef("")
    const studentId = useRef("")
    const reqType = useRef("External Scholarship")
    const reqDesc = useRef("")

    const options = ["External Scholarship", "Alternate Requirement"]

    const selectStudent = (student) => {
        if (student) {
        studentFName.current = student.value.fname
        studentLName.current = student.value.name_dot_num
        studentId.current = student.value.student_id
        } else {
        studentFName.current = ""
        studentLName.current = ""
        studentId.current = ""
        }
    }

    const onSubmit = () => {
        if (studentLName.current != "" && reqDesc.current != "") {
            setFormError("")

            // TO DO Update GHC Req here

            console.log(studentFName.current + " " + studentLName.current + " - " + reqType.current + ": " + reqDesc.current)
            props.handleCancel()
        } else if (studentLName.current) {
            setFormError("Error: Must provide a description of the requirement!")
            console.log("reached here2 ")
        } else if (reqDesc.current) {
            setFormError("Error: Must select a student!")
        } else {
            setFormError("Error: Must select a student and provide a description!")
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <div className={styles.form}>
                    <h2>Scholarship Req Form</h2>
                    <p>Please select a student and provide the name of the requirement</p>
                    <StudentSearch                           
                          fNameError={fNameError}
                          setfNameError={setfNameError}
                          lNameError={lNameError}
                          setlNameError={setlNameError}
                          selectStudent={student => selectStudent(student)} />
                    <SelectInput options={options.map((m) => ({label: m}))} label="Req Type" onChange={(type) => {reqType.current = type}}/>
                    <TextField label="Req Description" onChange={(event) => {reqDesc.current = event.target.value}} />
                    <SubmitButton label="Apply" handleChange={onSubmit} />
                    <SubmitButton label="Cancel" handleChange={props.handleCancel} />
                    <p className={styles.error}>{formError}</p>
                </div>
            </div>
        </div>
    )
}

export default ScholarshipReqForm 

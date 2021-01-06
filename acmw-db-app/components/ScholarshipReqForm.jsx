import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import SelectInput from './FormComponents/SelectInput'
import StudentSearch from './FormComponents/StudentSearch'
import styles from '../styles/components/Form.module.css'
import SubmitNotification from './FormComponents/SubmitNotification'
import {useState, useRef, useEffect} from 'react'

const ScholarshipReqForm = (props) => {
    const [showNotif, setShowNotif] = useState(false);
    const [fNameError, setfNameError] = useState("")
    const [lNameError, setlNameError] = useState("")

    const [formError, setFormError] = useState("")
    const subscribed = useRef(false);

    const studentLName = useRef("")
    const studentFName = useRef("")
    const studentId = useRef("")
    const reqType = useRef("External Scholarship")
    const reqDesc = useRef("")

    const options = ["External Scholarship", "Alternate Requirement"]

    // prevent async update if unmounted
    useEffect(() => {return () => {subscribed.current = false}}, []);

    const selectStudent = (student) => {
        if (student) {
        studentFName.current = student.fname
        studentLName.current = student.name_dot_num
        studentId.current = student.student_id
        } else {
        studentFName.current = ""
        studentLName.current = ""
        studentId.current = ""
        }
    }

    const onSubmit = async () => {
        subscribed.current = true;
        if (studentLName.current != "" && reqDesc.current != "") {
            setFormError("")

            const requestOptions = {
              method: 'POST',
              body: JSON.stringify(
                { name_dot_num: studentLName.current,
                  student_id: studentId.current,
                  req_type: reqType.current,
                  req_desc: reqDesc.current
                }
              )
            };
            const res = await fetch('/api/ghc/enter-external-scholarship', requestOptions);
            if(!subscribed.current) return;
            setShowNotif(true)
            subscribed.current = false;
        } else if (studentLName.current) {
            setFormError("Error: Must provide a description of the requirement!")
        } else if (reqDesc.current) {
            setFormError("Error: Must select a student!")
        } else {
            setFormError("Error: Must select a student and provide a description!")
        }
    }

    return (
        <div className={styles.popup_inner}>
            <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/>
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
                <p className={styles.error}>{formError}</p>
            </div>
        </div>
    )
}

export default ScholarshipReqForm

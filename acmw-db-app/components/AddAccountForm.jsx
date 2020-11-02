import styles from '../styles/components/CompanyForm.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import {useState} from 'react'

const AddAccountForm = (props) => {

    const [fname, setFname] = useState(props.autofill ? props.autofill[0] : "")
    const [lnamedotnum, setLnamedotnum] = useState(props.autofill ? props.autofill[1] : "")
    const [osuEmail, setOsuEmail] = useState(props.autofill ? props.autofill[1] + "@osu.edu" : "@osu.edu")
    const [password, setPassword] = useState("")
    const [studentID, setStudentID] = useState(props.autofill ? props.autofill[2] : "")

    const [fnameError, setFnameError] = useState("")
    const [lnamedotnumError, setLnamedotnumError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const onSubmit = () => {
        // Angela: I took these from Sara's StudentSearch so we should probably make a Regex utilities file
        const letters = new RegExp(/^[a-zA-Z]+$/) //maybe not? idk maybe needs dash or apostrophe
        const dotNumCheck = new RegExp(/^[a-zA-Z]+\.[1-9][0-9]*$/)
        const goodfname = letters.test(fname)
        const goodlnamedotnum = dotNumCheck.test(lnamedotnum)

        if (!fname || !lnamedotnum || !password || !goodfname || !goodlnamedotnum) {
          if (!fname) {
            setFnameError("Enter a first name.")
          } else if (!goodfname) {
            setFnameError("Enter a valid first name.")
          } else {
            setFnameError("")
          }
          if (!lnamedotnum) {
            setLnamedotnumError("Enter a last name dot dot number.")
          } else if (!goodlnamedotnum) {
            setLnamedotnumError("Enter a valid last name dot dot number.")
          } else {
            setLnamedotnumError("")
          }
          if (!password) {
            setPasswordError("Enter a password.")
          } else {
            setPasswordError("")
          }
        } else {
            setFnameError("")
            setLnamedotnumError("")
            setPasswordError("")
            create()
            props.closeForm()
        }
    }

    const create = async () => {
      let id = studentID;
      if (!props.autofill) { // creating a new student
          const requestOptions = {
            method: 'POST',
            body: JSON.stringify(
              { fname: fname, lname: lnamedotnum.split(/\./)[0], name_dot_num: lnamedotnum,
                personal_email: "",
                school_level: "",
                packet_sent_date: ""
              }
            )
          };
          const res1 = await fetch('/api/student/create', requestOptions);
          const result1 = await res1.json(); //returns the id
          id = result1[0]["id"];
          setStudentID(id);
      }
      // creating a new account
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: osuEmail, password: password, student_id: id})
      };
      const res2 = await fetch('/api/account/create', requestOptions);
      const result2 = await res2.json();
    }

    const updateLnamedotnum = (e) => {
      setLnamedotnum(e.target.value)
      setOsuEmail(e.target.value + "@osu.edu")
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    {props.autofill ? <h2>Create Account</h2> : <h2>Create Student and Account</h2>}
                    <div>
                        <TextField label="First Name" error={fnameError} value={fname} disabled={props.autofill} onChange={event => setFname(event.target.value)}/>
                        <TextField label="Last Name Dot Number" error={lnamedotnumError} value={lnamedotnum} disabled={props.autofill} onChange={event => updateLnamedotnum(event)}/>
                        {props.autofill && <TextField label="Student ID" value={studentID} disabled={true} />}
                        <TextField label="OSU Email Address" value={osuEmail} disabled={true} />
                        <TextField label="Password" error={passwordError} onChange={(event) => setPassword(event.target.value)}/>
                    </div>
                </form>
                <div className={styles.buttons}>
                    <SubmitButton label="Apply" handleChange={onSubmit} />
                    <SubmitButton label="Cancel" handleChange={props.closeForm} />
                </div>
            </div>
        </div>
    )
}

export default AddAccountForm

import styles from '../styles/components/CompanyForm.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import StudentSearch from '../components/FormComponents/StudentSearch'
import {useState} from 'react'

const AddAccountForm = (props) => {

    const [fname, setFname] = useState("")
    const [lnamedotnum, setLnamedotnum] = useState("")
    const [osuEmail, setOsuEmail] = useState("@osu.edu")
    const [password, setPassword] = useState("")
    const [studentID, setStudentID] = useState("")

    const [fNameError, setfNameError] = useState("");
    const [lNameError, setlNameError] = useState("");
    const [passwordError, setPasswordError] = useState("")

    const onSubmit = () => {
        // Angela: I took these from Sara's StudentSearch so we should probably make a Regex utilities file
        const letters = new RegExp(/^[a-zA-Z]+$/) //maybe not? idk maybe needs dash or apostrophe
        const dotNumCheck = new RegExp(/^[a-zA-Z]+\.[1-9][0-9]*$/)
        const goodfname = letters.test(fname)
        const goodlnamedotnum = dotNumCheck.test(lnamedotnum)

        if (!fname || !lnamedotnum || !password || !goodfname || !goodlnamedotnum ) {
            if (!fname) {
              setfNameError("Enter a first name")
            } else if (!goodfname) {
              setfNameError("First name must only contain letters!")
            } else {
              setfNameError("")
            }
            if (!lnamedotnum) {
              setlNameError("Enter a Last name.#")
            } else if (!goodlnamedotnum) {
              setlNameError("Last name.# is formatted incorrectly!")
            } else {
              setlNameError("")
            }
            if (!password) {
              setPasswordError("Enter a password")
            } else {
              setPasswordError("")
            }
        } else {
            setfNameError("")
            setlNameError("")
            setPasswordError("")
            create()
            props.closeForm()
        }
    }

    const create = async () => {
      let id = studentID; // for async protection
      if (!id) { // creating a new student
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
      }
      // creating a new account
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: osuEmail, password: password, student_id: id})
      };
      const res2 = await fetch('/api/account/create', requestOptions);
      const result2 = await res2.json();
    }

    const selectStudent = (student) => {
      console.log(student)
        if (student) {
          setFname(student.value.fname)
          setLnamedotnum(student.value.name_dot_num)
          setStudentID(student.value.student_id)
          setOsuEmail(student.value.name_dot_num + "@osu.edu")
        } else {
          setFname("")
          setLnamedotnum("")
          setStudentID("")
          setOsuEmail("@osu.edu")
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Create Account</h2>
                    <div>
                        <StudentSearch
                          fNameError={fNameError}
                          setfNameError={setfNameError}
                          lNameError={lNameError}
                          setlNameError={setlNameError}
                          selectStudent={student => selectStudent(student)}
                          />
                        <br />
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

import styles from '../styles/components/AccountForm.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import StudentSearch from '../components/FormComponents/StudentSearch'
import SelectInput from '../components/FormComponents/SelectInput'
import {useState} from 'react'

const AddAccountForm = (props) => {

    const accountTypes = [{label: "Exec"}, {label: "GHC"}]

    const [fname, setFname] = useState("")
    const [lnamedotnum, setLnamedotnum] = useState("")
    const [osuEmail, setOsuEmail] = useState("@osu.edu")
    const [password, setPassword] = useState("")
    const [studentID, setStudentID] = useState("")
    const [accountType, setAccountType] = useState(accountTypes[0].label)
    const [searchFound, setSearchFound] = useState(false)

    const [fNameError, setfNameError] = useState("");
    const [lNameDotNumError, setlNameDotNumError] = useState("");
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
              setlNameDotNumError("Enter a Last name.#")
            } else if (!goodlnamedotnum) {
              setlNameDotNumError("Last name.# is formatted incorrectly!")
            } else {
              setlNameDotNumError("")
            }
            if (!password) {
              setPasswordError("Enter a password")
            } else {
              setPasswordError("")
            }
        } else {
            create()
            props.closeForm()
        }
    }

    const create = async () => {
      let id = studentID; // for async protection
      if (!id) { // creating a new student
          let lname = lnamedotnum.split(/\./)[0];
          const requestOptionsStudent = {
            method: 'POST',
            body: JSON.stringify(
              { fname: fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase(), //capitalization convention
                lname: lname.charAt(0).toUpperCase() + lname.slice(1).toLowerCase(), //capitalization convention
                name_dot_num: lnamedotnum.toLowerCase(),
                personal_email: "", //these are blank for now
                school_level: "",
                packet_sent_date: ""
              }
            )
          };
          const res1 = await fetch('/api/student/create', requestOptionsStudent);
          const result1 = await res1.json(); //returns the id
          id = result1[0]["id"];
      }
      // creating a new account
      const requestOptionsAccount = { //currently account_type does not do anything; todo: make account_type col
        method: 'POST',
        body: JSON.stringify( // makes copies to prevent synthetic event error
          { email: osuEmail.toLowerCase(),
            password: password + "",
            student_id: id,
            account_type: accountType + "" }
        )
      };
      const res2 = await fetch('/api/account/create', requestOptionsAccount);
      // const result2 = await res2.json();
    }

    const selectStudent = (student) => {
        if (student) {
          let {fname, name_dot_num, student_id} = student;
          setSearchFound(true)
          setFname(fname)
          setLnamedotnum(name_dot_num)
          setStudentID(student_id)
          setOsuEmail(name_dot_num.toLowerCase() + "@osu.edu")
        } else {
          setSearchFound(false)
          setFname("")
          setLnamedotnum("")
          setStudentID("")
          setOsuEmail("@osu.edu")
        }
    }

    const handleLastNameChange = (event) => {
      let lastname = event.target.value;
      setLnamedotnum(lastname)
      setOsuEmail(lastname.toLowerCase() + "@osu.edu")
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Create Account</h2>
                    <div>
                        <div className={styles.box}>
                          <StudentSearch
                            fNameError={fNameError}
                            setfNameError={setfNameError}
                            lNameDotNumError={lNameDotNumError}
                            setlNameDotNumError={setlNameDotNumError}
                            selectStudent={student => selectStudent(student)}
                          />
                        </div>
                        <TextField label="First Name" value={fname} error={fNameError} onChange={(event) => setFname(event.target.value)} disabled={searchFound} />
                        <TextField label="Last Name.#" value={lnamedotnum} error={lNameDotNumError} onChange={(event) => handleLastNameChange(event)} disabled={searchFound} />
                        <TextField label="OSU Email Address" value={osuEmail} disabled={true} />
                        <TextField label="Password" error={passwordError} onChange={setPassword}/>
                        <SelectInput label='Account Type' options={accountTypes} onChange={setAccountType}/>
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

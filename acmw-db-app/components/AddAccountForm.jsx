import styles from '../styles/components/Form.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import StudentSearch from '../components/FormComponents/StudentSearch'
import SelectInput from '../components/FormComponents/SelectInput'
import SubmitNotification from './FormComponents/SubmitNotification'
import {useState} from 'react'
import {validateName, validateLastNameDotNum} from '../utility/utility';
import {adaFetch} from '../utility/fetch';

const AddAccountForm = (props) => {
    const [showNotif, setShowNotif] = useState(false);
    const accountTypes = [{label: "GHC"}, {label: "Exec"}]

    const [fname, setFname] = useState("")
    const [lnamedotnum, setLnamedotnum] = useState("")
    const [osuEmail, setOsuEmail] = useState("@osu.edu")
    const [studentID, setStudentID] = useState("")
    const [accountType, setAccountType] = useState(accountTypes[0].label)
    const [searchFound, setSearchFound] = useState(false)

    const [fNameError, setfNameError] = useState("");
    const [lNameDotNumError, setlNameDotNumError] = useState("");

    const onSubmit = () => {
        // Angela: I took these from Sara's StudentSearch so we should probably make a Regex utilities file
        const goodfname = validateName(fname)
        const goodlnamedotnum = validateLastNameDotNum(lnamedotnum)

        if (!fname || !lnamedotnum || !goodfname || !goodlnamedotnum ) {
            if (!fname) {
              setfNameError("Enter a first name")
            } else if (!goodfname) {
              setfNameError("First name must have at least one character!")
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
        } else {
          // temporary fix for bug with account type
            create().then(location.reload);
            //setShowNotif(true)
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
          const result1 = await adaFetch('/api/student/create', requestOptionsStudent);
          id = result1[0]["id"];
      }
      // creating a new account
      const requestOptionsAccount = { 
        method: 'POST',
        body: JSON.stringify( // makes copies to prevent synthetic event error
          { email: osuEmail.toLowerCase(),
            student_id: id,
            is_exec: (accountType === "Exec") + "" }
        )
      };
      await adaFetch('/api/account/create', requestOptionsAccount);
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
        <div className={styles.popup_inner}>
            <SubmitNotification showNotif={showNotif} setShowNotif={setShowNotif}/> 
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
                    <SelectInput label='Account Type' options={accountTypes} onChange={setAccountType}/>
                </div>
            </form>
            <div className={styles.buttons}>
                <SubmitButton label="Apply" handleChange={onSubmit} />
            </div>
        </div>
    )
}

export default AddAccountForm

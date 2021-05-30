import styles from '../styles/components/Form.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import StudentSearch from './FormComponents/StudentSearch'
import SelectInput from './FormComponents/SelectInput'
import SubmitNotification from './FormComponents/SubmitNotification'
import React, {useState, useRef, useEffect} from 'react'
import {validateName, validateLastNameDotNum} from '../utility/utility';

const AddAccountForm = (props) => {
    const [showNotif, setShowNotif] = useState(false);
    const accountTypes = [{label: "GHC"}, {label: "Exec"}]

    const [fname, setFname] = useState("")
    const [lnamedotnum, setLnamedotnum] = useState("")
    const [osuEmail, setOsuEmail] = useState("@osu.edu")
    const [studentID, setStudentID] = useState("")
    const [accountType, setAccountType] = useState(accountTypes[0])
    const [usingSearch, setUsingSearch] = useState(true)

    const [fNameError, setfNameError] = useState("");
    const [lNameDotNumError, setlNameDotNumError] = useState("");
    const [accountExistsError, setAccountExistsError] = useState("");
    const subscribed = useRef(false);

    useEffect(() => {return () => {subscribed.current = false}}, []);

    const onSubmit = () => {
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
            create().then(() => {
              setlNameDotNumError("");
              setfNameError("");
              setAccountExistsError("");
            })
        }
    }

    const create = async () => {
      subscribed.current = true;
      let id = studentID; // for async protection
      if (!id) { // creating a new student
          let lname = lnamedotnum.split(/\./)[0];
          const requestOptionsStudent = {
            method: 'POST',
            body: JSON.stringify(
              { fname: fname,
                lname: lname,
                name_dot_num: lnamedotnum.toLowerCase(),
                personal_email: "", //these are blank for now
                school_level: "",
                packet_sent_date: ""
              }
            )
          };
          const res1 = await fetch('/api/student/create', requestOptionsStudent);
          const result1 = await res1.json(); //returns the id
          if (result1.error) {
            if (result1.error.routine === "_bt_check_unique") {
              // uniqueness error / duplicate student
              const url = '/api/student/search?fname=' + fname + '&name_dot_num=' + lnamedotnum;
              const resp = await fetch(url, {method: 'GET'});
              const response = await resp.json();
              id = response[0]["id"];
            } else {
              throw("Schrödinger's student (or our API doesn't work): " + result1.error.detail);
            }
          } else {
            id = result1[0]["id"];
          }
      }

      // creating a new account
      // first check that there is not an existing account
      const url = '/api/account/exists?email=' + osuEmail.toLowerCase();
      const res = await fetch(url, {method: 'GET'});
      const results = await res.json();
      if (results.rowCount === 0) {
        // account does not exist, make one
        const requestOptionsAccount = { 
          method: 'POST',
          body: JSON.stringify( // makes copies to prevent synthetic event error
            { email: osuEmail.toLowerCase(),
              student_id: id,
              is_exec: (accountType.label === "Exec") + "" }
          )
        };
        await fetch('/api/account/create', requestOptionsAccount);
        if(subscribed.current) setShowNotif(true)
        subscribed.current = false;
      } else {
        // account does exist, give notification
        if(subscribed.current) setAccountExistsError("An account for " + osuEmail.toLowerCase() + " already exists!");
        subscribed.current = false;
      }
    }

    const selectStudent = (student) => {
        if (student) {
          let {fname, name_dot_num, student_id} = student;
          setFname(fname)
          setLnamedotnum(name_dot_num)
          setStudentID(student_id)
          if (name_dot_num) setOsuEmail(name_dot_num.toLowerCase() + "@osu.edu")
        } else {
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
                Fill out this form to create an account for an exec board member or a GHC scholarship recipient. 
                The account will be created with a randomized password, unknown to anyone, so the new account owner 
                must set a password by going to the sign-in page and requesting a password reset email to use the account.

                {/* Section 1 - name and name dot number */}
                <h3>1. Student info</h3>
                <div className={styles.indent}>
                  {/* Indicate if using student search or manual creation */}
                  <div onChange={(event) => setUsingSearch(event.target.value === "true")}>
                    <input type="radio" name="useSearch" value="true" defaultChecked="checked"/> 
                      Create account from student found in Student Search (try this first) <br/>
                    <input type="radio" name="useSearch" value="false"/> 
                      Student not found in Search - manually enter details for account
                  </div>
                  {/* Show student search or regular text fields depending on above selection */}
                  <div>
                  {usingSearch ? 
                    ( <StudentSearch
                      fNameError={fNameError}
                      setfNameError={setfNameError}
                      lNameDotNumError={lNameDotNumError}
                      setlNameDotNumError={setlNameDotNumError}
                      selectStudent={student => selectStudent(student)}
                    /> )
                  :
                    ( <> <h3>Manual Entry</h3>
                    <TextField label="First Name" value={fname} error={fNameError} onChange={(event) => setFname(event.target.value)}/>
                    <TextField label="Last Name.#" value={lnamedotnum} error={lNameDotNumError} onChange={(event) => handleLastNameChange(event)}/>
                    </> ) 
                  }
                  </div>
                </div>

                {/* Section 2 - GHC-only or Exec account */}
                <h3>2. Permissions (GHC-only or Exec)</h3>
                <div className={styles.indent}><SelectInput label='Account Type' options={accountTypes} onChange={setAccountType}/></div>

                {/* Section 3 - Review, submit */}
                <h3>3. Review</h3>
                <div className={styles.indent}>
                  Creating 
                  <b> {accountType && accountType.label ? accountType.label : '___'}</b> account for 
                  <b> {fname ? fname : '____'} {lnamedotnum ? lnamedotnum : "______"}</b> with email address 
                  <b> {osuEmail}</b>.
                </div>
                    
            </form>
            <div className={styles.buttons}>
                <SubmitButton label="Submit" handleChange={onSubmit} disabled={!osuEmail || !fname || !lnamedotnum} />
                <h3 className={styles.error}>{accountExistsError}</h3>
            </div>
        </div>
    )
}

export default AddAccountForm

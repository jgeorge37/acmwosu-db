import SelectInput from '../components/FormComponents/SelectInput'
import styles from '../styles/SignIn.module.css';
import React, { useState, useEffect } from 'react';
import {validateName, validateLastNameDotNum} from '../utility/utility';
import Head from 'next/head'

const AttendanceForm = () => {

    const yearOptions = [
      {label: "First", value: 1},
      {label: "Second", value: 2},
      {label: "Third", value: 3},
      {label: "Fourth", value: 4},
      {label: "Fifth+", value: 5},
      {label: "Graduate or Phd student :)", value: 6}
    ];
    const listServOptions = [
      {label: "I am already on the list :)", value: false},
      {label: "Yes, please!", value: true},
      {label: "Nope, thank you", value: false}
    ];

    const [eventCode, setEventCode] = useState("");
    const [autoCode, setAutoCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [year, setYear] = useState(yearOptions[0]);
    const [listServ, setListServ] = useState(listServOptions[0]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      const search = window.location.search;
      if(search && search.indexOf("?code=") === 0) {
        const ac = search.split("?code=")[1];
        setAutoCode(ac);
        setEventCode(ac);
      }
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Attendance Form</title>
            </Head>
            <div className={styles.card}>
                <h1>Attendance Form</h1>
                {
                  success ?
                  <h2>Attendance submitted successfully.</h2> :
                  <>
                  <p>Thank you for attending an ACM-W event! Please fill out this form to record your attendance!</p>
                  <h2>Event Information</h2>
                  <TextInput
                      id="Event Code"
                      input type="text"
                      label="Event Code"
                      predicted="007"
                      value={!!autoCode ? autoCode : eventCode}
                      disabled={!!autoCode}
                      onChange={setEventCode}/>
                  {
                    autoCode && <i style={{color: 'orchid'}}>
                      Event code auto-filled from URL - click <u><a href='/attendance'>here</a></u> for a blank form.
                    </i>
                  }
                  <TextInput
                      id="First Name"
                      input type="text"
                      label="First Name"
                      predicted="Brutus"
                      onChange={setFirstName}/>
                  <TextInput
                      id="Last Name"
                      input type="text"
                      label="Last Name.#"
                      predicted="Buckeye.1"
                      onChange={setLastName}/>
                  <div>
                      <h2>What year are you in?</h2>
                      <SelectInput options={yearOptions} onChange={setYear}/>
                  </div>
                  <div>
                      <h2>Would you like to be added to our mailing list (weekly newsletter)?</h2>
                      <SelectInput options={listServOptions} onChange={setListServ}/>
                  </div>
                  <span>
                      <SubmitButton
                          label="Submit"
                          eventCode={eventCode}
                          firstName={firstName}
                          lastName={lastName}
                          year={year}
                          listServ={listServ}
                          setSuccess={setSuccess}
                      />
                  </span>
                  </>
                }
            </div> 
        </div>
    )
}

export default AttendanceForm

const TextInput = (props) => {

    const [id, setId] = useState(props.id);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState("");
    const [label, setLabel] = useState(props.label);
    const [predicted, setPredicted] = useState(props.predicted);
    const [type, setType] = useState(props.type);

    useEffect(() => {
      if(!!props.value) setValue(props.value)
    }, [props.value])

    const changeValue = (event) => {
      setValue(event.target.value);
      props.onChange(event.target.value);
    }

    const handleKeyPress = (event) => {
      if (predicted && predicted.startsWith(value) && event.key === "Enter") {
        setValue(predicted);
        props.onChange(predicted);
      }
    }

/* APPEARANCE LOGIC
     if not active and value (user input) is empty
      then display placeholder white and background lighter purpur

     if not active and value is non-empty
      then display value white and background purpur

     if active (it is focused bc user clicked/tabbed to it)
      then display label bright purpur; display value dark gray; hide placeholder
  */
 return (
    <div className={`${styles.field} ${active ? styles.active : ( value && styles.filled )}`}>
      { type === "text" ?
        ( active &&
          predicted &&
          predicted.startsWith(value) ?
          <p className={styles.predicted}>{predicted}</p> :
          ( !value && <p className={styles.placeholder}>{label}</p> ) ) :
          ( type === "Last Name" &&
            !active &&
            !value &&
            <p className={styles.placeholder}>{label}</p> )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={event => changeValue(event)}
        onKeyPress={event => handleKeyPress(event)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        disabled={props.disabled}
      />
      <label htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

const SubmitButton = (props) => {

  const [message, setMessage] = useState("");

    const validateSubmitButton = async () => {
     // let firstnameCheck = validateName(props.firstName)
     // let lastnameCheck = validateLastNameDotNum(props.lastName);
      if(validateName(props.firstName) && validateLastNameDotNum(props.lastName)) {
        const res = await recordAttendance();
        if(res.ok) {
          props.setSuccess(true);
        } else {
          setMessage("Error")
          const result = await res.json();
          setMessage("Error" + (result.error ? `: ${result.error}` : ""));
        }
      } else {
        setMessage("Enter a valid first name and last name dot number.");
      }
  } 

  const recordAttendance = async () => {
    const requestAttendanceRecord = {
      method: 'POST',
      body: JSON.stringify(
        { event_code: props.eventCode,
          f_name: props.firstName,
          l_name_dot_num: props.lastName, //lastName is last name . num
          year_level: props.year.label, // this will push the string ex:"Fourth"
          list_serv: props.listServ.value  // true or false
        }
      )
    };
    const res = await fetch('/api/attendance/record', requestAttendanceRecord);
    return res;
  }

  return (
    <div className={styles.attendanceButton}>
      {<div><label className={styles.error}>
        {message}
      </label></div>}
      <button className={styles.button} onClick={async () => await validateSubmitButton()}>
        Submit
      </button>
    </div>
  );
}

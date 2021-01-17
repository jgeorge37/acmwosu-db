import SelectInput from '../components/FormComponents/SelectInput'
import styles from '../styles/SignIn.module.css';
import React, { useState } from 'react';
import {validateName, validateLastNameDotNum} from '../utility/utility';
import Head from 'next/head'
import React from 'react'

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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [year, setYear] = useState(yearOptions[0]);
    const [listServ, setListServe] = useState(listServOptions[0]);

    
    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Attendance Form</title>
            </Head>
            <div className={styles.card}>
                <h1>Attendance Form</h1>
                <p>Thank you for attending an ACM-W event! Please fill out this form to record your attendance!</p>
                <h2>Event Information</h2>
                <TextInput
                    id="Event Code"
                    input type="text"
                    label="Event Code"
                    predicted="007"
                    onChange={setEventCode}/>
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
                    <h2>Would you like to be included in our list-serv?</h2>
                    <SelectInput options={listServOptions} onChange={setListServe}/>
                </div>
                <span>
                    <SubmitButton
                        label="Submit"
                        eventCode={eventCode}
                        firstName={firstName}
                        lastName={lastName}
                        year={year}
                    />
                </span>
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
          setMessage("Success");
        } else {
          setMessage("Failure");  // this could be the result of an invalid event code
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
          year_level: props.year.label // this will push the string ex:"Fourth"
        }
      )
    };
    const res = await fetch('/api/attendance/record', requestAttendanceRecord);
    return res;
  }

  return (
    <div>
      {<div><label className={styles.error}>
        {message}
      </label></div>}
      <button className={styles.button} onClick={async () => await validateSubmitButton()}>
        Submit
      </button>
    </div>
  );
}

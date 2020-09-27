import SelectInput from '../components/FormComponents/SelectInput'
import styles from '../styles/SignIn.module.css';
import React, { useState } from 'react';
import Head from 'next/head'

const AttendanceForm = () => {

    const [eventCode, setEventCode] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState("");

    const yearOptions = ["First", "Second", "Third", "Fourth", "Fifth+", "Graduate or Phd student :)"]
    const listServOptions = ["I am already on the list :)", "Yes, please!", "Nope, thank you"]

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
                    predicted="Buckeye" 
                    onChange={setLastName}/>
                <div>
                    <h2>What year are you in?</h2>
                    <SelectInput options={yearOptions}/>
                </div>
                <div>
                    <h2>Would you like to be included in our list-serv?</h2>
                    <SelectInput options={listServOptions}/>
                </div>
                <span>
                    <SubmitButton 
                        label="Submit" 
                        eventCode={eventCode}
                        firstName={firstName}
                        lastName={lastName}
                        onSubmit={setStatus}
                        status={status}
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

    // If event code is valid, add a database entry, and display "Submitted successfully" message
    // Else if the event code is not valid, display "Invalid event code" message

    const validateSubmitButton = async () => {
    const regex = new RegExp(/^[a-z ,.'-]+$/i); //tests for first name
    const regexLast = new RegExp(/^[a-z ,.'-]+\.[1-9]+$/i); //tests for last name.#

    // can change the 007 to actual event codes later
    // This would be changed to pull from a database of event codes and see if there is a match (maybe?)
    // Sara: Actually this form might be slightly different depending on how the website is set up.
    // If ACM-W users are able to login to their personal accounts, then we would just need the event code.
    // This is just going off of past attendance forms.
    
    if ((props.eventCode == "007") && regex.test(props.firstName) && regexLast.test(props.lastName)) {
        props.onSubmit("Success");
        setMessage("Successfully submitted your attendance.")
    } else {
      props.onSubmit("Failure");
      if (!regex.test(props.firstName) && !regexLast.test(props.lastName)) {
        setMessage("Please enter your first and last name.")
      } else if (!(props.eventCode == "007")) {
        // can change the 007 to actual event codes later
        setMessage("Please enter valid event code.")
      } else if (!regexLast.test(props.lastName)) {
        setMessage("Please enter your last name.#")
      } else if (!regex.test(props.firstName)) {
        setMessage("Please enter your first name.");
      }
    }
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

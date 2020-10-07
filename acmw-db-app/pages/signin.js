import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import React, { useState } from 'react';

const SignIn = () => {
  // TODO link to page that sends password by email?

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>ACM-W Database Sign In</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <img src="/logo.png" alt="ACM-W Logo" className={styles.logo} />
          <h1> OSU Database </h1>
          <h2> Please sign in to continue </h2>
          <TextInput
            id="username"
            label="Email"
            predicted="buckeye.1@osu.edu"
            onChange={setEmail}
            status={status}
            type="text"
          />
          <div className={styles.passwordChunk}>
            <TextInput
              id="password"
              label="Password"
              status={status}
              onChange={setPassword}
              type="password"
            />
            <a className={styles.smol} href="/reset">Forgot password?</a>
          </div>
          <SignInButton
            email={email}
            password={password}
            onSubmit={setStatus}
            status={status}
          />
        </div>
      </main>
    </div>
  )
}

export default SignIn

const TextInput = (props) => {

  const [id, setId] = useState(props.id);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState(props.label);
  const [type, setType] = useState(props.type);
  const [predicted, setPredicted] = useState(props.predicted);

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
          ( type === "password" &&
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

const SignInButton = (props) => {

  const [message, setMessage] = useState("");

  const validateSignIn = async () => {
    // Check that email and password match
    
    //matches case insensitive letters. number w/o leading 0 @ (buckeyemail.) osu . edu
    const regex = new RegExp(/^([a-z]+\.[1-9]([0-9]+)?@(buckeyemail\.)?osu\.edu)$/i);
    if (props.email && props.password && regex.test(props.email)) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: props.email, password: props.password })
      };
      const res = await fetch('/api/account/verify', requestOptions);
      const result = await res.json();

      if(!result || result.length === 0) {
        props.onSubmit("Failure");
        setMessage("Incorrect email or password.");
      } else {
        localStorage.setItem("user", JSON.stringify(result[0]));
        props.onSubmit("Success");
      }
    } else {
      props.onSubmit("Failure");
      if (!props.email && !props.password) {
        setMessage("Please enter your email and password.")
      } else if (!props.email) {
        setMessage("Please enter your OSU email.")
      } else if (!props.password) {
        setMessage("Please enter your password.")
      } else {
        setMessage("Invalid OSU email address.");
      }
    }
  }

  return (
    <div>
      {props.status === "Failure" &&
      <div><label className={styles.error}>
        {message}
      </label></div>}
      <button className={styles.button} onClick={async () => await validateSignIn()}>
        Submit
      </button>
    </div>
  );
}

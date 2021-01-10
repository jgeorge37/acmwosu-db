import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import {validateEmail} from '../utility/utility';
import React, { useEffect, useState, useRef } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // submit fail/success
  const [message, setMessage] = useState(""); // if fail, error message
  const subscribed = useRef(false);

  const redirect = (userInfo) => {
    let page = "scholarshipprogress";
    // check if page to go to is given in URL
    const to = window.location.href.split("?to=")[1];
    if((to && to === "exec") || (!to && userInfo.is_exec)) page = "execdashboard";
    // redirect to new page
    window.location = `/${page}`;
  }

  const validateSignIn = async () => {
    event.preventDefault(); // prevents auto-refresh of page
    subscribed.current = true;

    if (email && password && validateEmail(email)) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password })
      };
      const res = await fetch('/api/account/verify', requestOptions);
      const result = await res.json();

      if(!subscribed.current) return;

      if(!result || result.length === 0) {
        setStatus("Failure");
        setMessage("Incorrect email or password.");
      } else {
        localStorage.setItem("email", result[0].email);
        setStatus("Success");
        redirect(result[0]);
      }
    } else {
      setStatus("Failure");
      if (!email && !password) {
        setMessage("Please enter your email and password.")
      } else if (!email) {
        setMessage("Please enter your OSU email.")
      } else if (!password) {
        setMessage("Please enter your password.")
      } else {
        setMessage("Invalid OSU email address.");
      }
    }
    subscribed.current = false;
  }

  // prevent state update on unmounted components
  useEffect(() => {
    return () => {subscribed.current = false};
  }, [])

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
          <form onSubmit={async (event) => await validateSignIn(event)}>
            <div className={styles.passwordChunk}>
              <TextInput
                id="password"
                label="Password"
                status={status}
                onChange={setPassword}
                type="password"
              />
              <a className={styles.smol} href="/forgotPassword">Forgot password?</a>
            </div>
            <div> {/* button */}
              {status === "Failure" &&
              <div><label className={styles.error}>
                {message}
              </label></div>}
              <button type="submit" className={styles.button}>
                Submit
              </button>
            </div>
          </form>
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

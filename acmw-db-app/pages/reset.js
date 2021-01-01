import Head from 'next/head'
import styles from '../styles/Reset.module.css'
import {validatePassword} from './api/utility';
import React, { useEffect, useState, useRef } from 'react';

const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [view, setView] = useState("");
  const subscribed = useRef(false);

  const checkToken = async () => {
    subscribed.current = true;
    // very hacky for now; setting up react router needs to be its own ticket
    const tok = window.location.href.split("?token=")[1];
    var em = -1;
    if(tok) {
      const res = await (await fetch(`/api/account/check-reset?token=${tok}`)).json();
      if(res.length > 0) em = res[0].email;
    }
    if(subscribed.current) setEmail(em);
    subscribed.current = false;
  }

 // using useEffect to not try to look at the window on the server side
  useEffect(() => {
    checkToken().then(() => {
        email === -1 ?
        setView(<InvalidLink/>) :
        email === "" ?
          setView("Loading...") :
          setView(<ResetForm email={email} changeView={setView}/>)
    });
  },[email]);


  // prevent async update if unmounted
  useEffect(() => {return () => {subscribed.current = false}}, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Password Reset</title>
      </Head>
      {view}
    </div>
  );
}

export default Reset;

const InvalidLink = (props) => {
  return (
    <main className={styles.card}>
        <h3>Password reset link invalid or expired.</h3>
        <div><a className={styles.smol} href="../signin">Sign in</a></div>
        <div><a className={styles.smol} href="../forgotPassword">Get new password reset link</a></div>
    </main>
  )
}

const ResetForm = (props) => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [error, setError] = useState("");
  const subscribed = useRef(false);

  // prevent async update if unmounted
  useEffect(() => {return () => {subscribed.current = false}}, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevents auto-refresh of page
    subscribed.current = true;
    if(validate()){
      // submit new password
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: props.email, password: input1 })
      };
      const res = await (await fetch('/api/account/reset-pw', requestOptions)).text();
      // display "submitted" view
      if(subscribed.current) props.changeView(
        <main className={styles.card}>
          {res}
          <div><a className={styles.smol} href="../signin">Sign in</a></div>
        </main>
      );
    }
    subscribed.current = false;
  }

  const validate = () => {
      <h6>Password must be at least 8 characters long and contain at least 1 each of: uppercase letter, lowercase letter, digit, special character</h6>

      var err = "";

      if (!validatePassword(input1)) {
        err = "Password must have: 1 digit, 1 uppercase letter, 1 lowercase letter, 1 special character, length of 8+";
      } else if(!input1 || !input2) {
        err = "Please enter and confirm a password";
      } else if (input1 !== input2) {
        err = "Passwords do not match";
      }
      setError(err);
      return err.length === 0;
  }

  return (
      <main className={styles.card}>
        <h1>Password Reset</h1>

        <div className={styles.passwordRequirements}>
          <ul>Enter a password with at least
            <li>one uppercase letter</li>
            <li>one lowercase letter</li>
            <li>one special character</li>
            <li>8 characters</li>
          </ul>
        </div>

        <div className={styles.password1Chunk}>
          <label className={styles.labelStyle} htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={input1}
            onChange={event => setInput1(event.target.value)}
            placeholder="Enter password"
            id="password" />
        </div>

        <form onSubmit={async (event) => await handleSubmit(event)}>
          <div className={styles.passwordChunk}>
            <label className={styles.labelStyle} htmlFor="password">Confirm Password:</label>
            <input
              type="password"
              name="confirm_password"
              value={input2}
              onChange={event => setInput2(event.target.value)}
              placeholder="Enter confirm password"
              id="confirm_password" />
          </div>
          <div className={styles.error}>{error}</div>
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>

        <div><a className={styles.smol} href="../signin">Sign in</a></div>

      </main>
  )
}

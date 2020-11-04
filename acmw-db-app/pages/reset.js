import Head from 'next/head'
import styles from '../styles/Reset.module.css'
import React, { useEffect, useState } from 'react';

const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [view, setView] = useState("");
  
  const checkToken = async () => {
    // very hacky for now; setting up react router needs to be its own ticket
    const tok = window.location.href.split("?token=")[1];
    var em = -1;
    if(tok) {
      const res = await (await fetch(`/api/account/check-reset?token=${tok}`)).json();
      if(res.length > 0) em = res[0].email;
    }
    setEmail(em);
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

  const handleSubmit = async () => {
    if(validate()){
      // submit new password
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email: props.email, password: input1 })
      };
      const res = await (await fetch('/api/account/reset-pw', requestOptions)).text();
      // display "submitted" view
      props.changeView(
        <main className={styles.card}>
          {res}
          <div><a className={styles.smol} href="../signin">Sign in</a></div>
        </main>
      );
    }
  }
  
  const validate = () => {
      <h6>Please enter a password containing at least 1 uppercase, 1 lowercase, 1 digit, 1 special character with a length of at least of 8</h6>
      
      var err = "";

      var pattern = new RegExp(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/i);
      if (!pattern.test(input1)) {
        err = "Password must have: 1 uppercase, 1 lowercase, 1 special character, length of 8+";
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
      <button className={styles.button} onClick={async () => await handleSubmit()}>
        Submit 
      </button>

      <div><a className={styles.smol} href="../signin">Sign in</a></div>

    </main>
  )
}

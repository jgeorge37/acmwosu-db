import Head from 'next/head'
import styles from '../styles/Reset.module.css'
import {validateEmail} from '../utility/utility';
import React, { useEffect, useState, useRef } from 'react';

const ForgotPassword = (props) => {
  const [view, setView] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>Forgot Password</title>
      </Head>
    <main className={styles.card}>
      {view === "submitted" ?
      <h3>Password reset email sent to {email}</h3> :
      <PasswordForm changeView={setView} changeEmail={setEmail}/>}
      <div><a className={styles.smol} href="../signin">Sign in</a></div>
    </main>
    </div>
  );
}

export default ForgotPassword;

const PasswordForm = (props) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const subscribed = useRef(false);

  // prevent async update if unmounted
  useEffect(() => {return () => {subscribed.current = false}}, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevents auto-refresh of page
    subscribed.current = true;
    if(validate()){
      // Generate password reset token
      const email = input.slice(0);  // copy string value to not make an alias
      const requestOpts = {
        method: 'POST',
        body: JSON.stringify({ email: email })
      };
      const data = await (await fetch('/api/account/generate-token', requestOpts)).json();
      if(data.rowCount !== 0) {
        requestOpts.body = JSON.stringify({token: data.token, email: email});
        await fetch('/api/mailer/reset-pw', requestOpts);
        if(!subscribed.current) return;
        props.changeEmail(email);
        props.changeView("submitted");
      } else {
        // email does not belong to an account
        if(!subscribed.current) return;
        setError(`No account found for ${email}`);
        setInput("");
      }
    }
    subscribed.current = false;
  }

  const validate = () => {
    var isValid = false;
    if (input.length > 0) {
      isValid = validateEmail(input);
    }
    if(!isValid) setError("Enter a valid osu.edu email");
    return isValid;
  }

  return (
        <div>
          <h1>Forgot Password</h1>
          <form onSubmit={async (event) => await handleSubmit(event)}>
            <div className={styles.passwordChunk}>
              <label className={styles.labelStyle} htmlFor="email">Email Address:</label>
              <input
                type="text"
                name="email"
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Enter email"
                id="email" />
                <div className={styles.error}>{error}</div>
            </div>
            <button type="submit" className={styles.button}>Submit</button>
          </form>
      </div>
  );
}

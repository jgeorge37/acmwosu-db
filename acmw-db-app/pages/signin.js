import Head from 'next/head'
import styles from '../styles/SignIn.module.css'
import React, { useState } from 'react';

const SignIn = () => {
  // TODO link to page that sends password by email?
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
            label="Username"
            predicted="Brutus Buckeye"
            type="text"
          />
          <div className={styles.passwordChunk}>
            <TextInput
              id="password"
              label="Password"
              type="password"
            />
            <a className={styles.smol} href="https://crouton.net/">Forgot username or password?</a>
          </div>
          <SignInButton
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
  const [error, setError] = useState("");
  const [label, setLabel] = useState(props.label);
  const [type, setType] = useState(props.type);
  const [predicted, setPredicted] = useState(props.predicted);

  const changeValue = (event) => {
    setValue(event.target.value);

    // TODO: Set failed label on password when failed to login
    // this.setState({error: "Failed!"});
  }

  const handleKeyPress = (event) => {
    if (!value && event.key === "Enter") {
      setValue(predicted);
    }
  }

  /* APPEARANCE LOGIC
     if not active and value (user input) is empty
      then display placeholder white and background lighter purpur

     if not active and value is non-empty
      then display value white and background purpur

     if active (it is focused bc user clicked/tabbed to it)
      then display label bright purpur; display value dark gray; hide placeholder

     if error (incorrect password)
      then display error red; hide label
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
      <label htmlFor={id} className={error && styles.error}>
        {error || label}
      </label>
    </div>
  );
}

class SignInButton extends React.Component {

  handleClick() {
    console.log("YOU CLICKED ME!");
  }

  render() {
    return (
      <button className={styles.button} onClick={() => this.handleClick()}>
        Submit
      </button>
    );
  }
}

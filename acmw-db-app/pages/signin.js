import Head from 'next/head'
import styles from '../styles/SignIn.module.css'
import React from 'react';

function SignIn() {
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

class TextInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      active: false,
      value: props.value || "",
      error: props.error || "",
      label: props.label || "",
      type: props.type || "text",
      predicted: props.predicted || "",
    };
  }

  changeValue(event) {
    const value = event.target.value;
    this.setState({value});

    // TODO: Set failed label on password when failed to login
    // this.setState({error: "Failed!"});
  }

  handleKeyPress(event) {
    if (!this.state.value && event.key === "Enter") {
      this.setState({ value: this.props.predicted });
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
  render() {
    const { id, active, value, error, label, type, predicted } = this.state;
    const fieldClassName = `${styles.field} ${active ? styles.active : ( value && styles.filled )}`;
    return (
      <div className={fieldClassName}>
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
          onChange={this.changeValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          onFocus={() => this.setState({ active: true })}
          onBlur={() => this.setState({ active: false })}
        />
        <label htmlFor={id} className={error && styles.error}>
          {error || label}
        </label>
      </div>
    );
  }
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

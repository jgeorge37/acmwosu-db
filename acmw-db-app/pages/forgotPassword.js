import Head from 'next/head'
import styles from '../styles/Reset.module.css'
import React, { useState } from 'react';
  
class forgotPassword extends React.Component {
    constructor() {
    super();
    this.state = {
      input: {},
      errors: {}
    };
     
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
     
  handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;
  
    this.setState({
      input
    });
  }
     
  handleSubmit(event) {
    event.preventDefault();
  
    if(this.validate()){
        let input = {};
        input["email"] = "";
        this.setState({input:input});
    }
  }
  
  validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = false;

        if (input.email !== "undefined" && input.email !== null && input.email !== "") {

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          if (pattern.test(input["email"])) {
            isValid = true;
          }
        }
      if(!isValid){
        errors["email"] = "Please enter valid email address.";
      }

      this.setState({
        errors: errors
      });
    
      return isValid;
  }
     
  render() {
    return (
      <div className={styles.container}>
        <Head>
        <title>ACM-W Database Forgot Password</title>
        </Head>
      <main className={styles.card}>
        <h1>Forgot Password</h1>
        <form onSubmit={this.handleSubmit}>

        { <div className={styles.passwordChunk}>
            <label className={styles.labelStyle} htmlFor="email">Email Address:</label>
            <input 
              type="text" 
              name="email" 
              value={this.state.input.email || ""}
              onChange={this.handleChange}
              placeholder="Enter email" 
              id="email" />
  
              <div className="text-danger">{this.state.errors.email}</div>
          </div> } 

          <input type="submit" value="Submit"  className={styles.button}/>
          <div><a className={styles.smol} href="../signin">Login Instead?</a></div>
        </form>
        </main>
      </div>
    );
  }
}
  
export default forgotPassword;

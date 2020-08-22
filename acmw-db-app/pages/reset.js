import Head from 'next/head'
import styles from '../styles/Reset.module.css'
import React, { useState } from 'react';
  
class ResetPW extends React.Component {
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
        console.log(this.state);
  
        let input = {};
        input["name"] = "";
        input["email"] = "";
        input["password"] = "";
        input["confirm_password"] = "";
        this.setState({input:input});
  
        alert('Passwords match. Form "submitted"');
    }
  }
  
  validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
  
      if (!input["name"]) {
        isValid = false;
        errors["name"] = "Please enter your name.";
      }
  
      if (!input["email"]) {
        isValid = false;
        errors["email"] = "Please enter your email Address.";
      }
  
      if (typeof input["email"] !== "undefined") {
          
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(input["email"])) {
          isValid = false;
          errors["email"] = "Please enter valid email address.";
        }
      }
  
      <h6>Please enter a password containing at least 1 uppercase, 1 lowercase, 1 digit, 1 special character with a length of at least of 8</h6>
      var pattern = new RegExp(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/i);
      if (!pattern.test(input["password"])) {
        isValid = false;
        errors["password"] = "Please try a new password with the given constraints: 1 uppercase, 1 lowercase, 1 special character, length of 8+";
      }
      if (!input["password"]) {
        isValid = false;
        errors["password"] = "Please enter your password.";
      }
  
      if (!input["confirm_password"]) {
        isValid = false;
        errors["confirm_password"] = "Please confirm your password.";
      }
  
      if (typeof input["password"] !== "undefined" && typeof input["confirm_password"] !== "undefined") {
          
        if (input["password"] != input["confirm_password"]) {
          isValid = false;
          errors["password"] = "Passwords don't match.";
        }
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
        <title>ACM-W Database Password Reset</title>
        </Head>

      <main className={styles.card}>
        <h1>Password Reset</h1>
        <form onSubmit={this.handleSubmit}>
  
        <div className={styles.passwordChunk}>
            <label className={styles.labelStyle} htmlFor="name">Name:</label>
            <input 
              type="text" 
              name="name" 
              value={this.state.input.name}
              onChange={this.handleChange}
              //class="form-control" 
              placeholder="Enter name" 
              id="name" />
  
              <div className="text-danger">{this.state.errors.name}</div>
          </div>
  
          <div className={styles.passwordChunk}>
            <label className={styles.labelStyle} htmlFor="email">Email Address:</label>
            <input 
              type="text" 
              name="email" 
              value={this.state.input.email}
              onChange={this.handleChange}
              //class="form-control" 
              placeholder="Enter email" 
              id="email" />
  
              <div className="text-danger">{this.state.errors.email}</div>
          </div>
   
          <div className={styles.passwordRequirements}>
            <ul>Enter a password with at least...
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
              value={this.state.input.password}
              onChange={this.handleChange}
              //class="form-control" 
              placeholder="Enter password" 
              id="password" />
  
              <div className="text-danger">{this.state.errors.password}</div>
          </div>
  
          <div className={styles.passwordChunk}>
            <label className={styles.labelStyle} htmlFor="password">Confirm Password:</label>
            <input
              type="password" 
              name="confirm_password" 
              value={this.state.input.confirm_password}
              onChange={this.handleChange}
              //class="form-control" 
              placeholder="Enter confirm password" 
              id="confirm_password" />
  
              <div className="text-danger">{this.state.errors.confirm_password}</div>
          </div>
              
          <input type="submit" value="Submit" class="btn btn-success" className={styles.button}/>

          <div><a className={styles.smol} href="../signin">Login Instead?</a></div>

        </form>
        </main>
      </div>
    );
  }
}
  
export default ResetPW;
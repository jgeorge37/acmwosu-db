import styles from '../styles/components/NavBar.module.css';
import React, {Fragment, useEffect, useState} from 'react';


const NavBar = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);

  useEffect(() => {
    if(showAlert) {
      const timer = setTimeout(() => {
        setHideAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const logoutAlert = (
    <div className={styles.alert}>
      Successfully logged out &#x2705;
    </div>
  )

  const cornerButton = props.user ? 
  (
    <li className={`${styles.tab} ${styles.account}`}>
      <span className={styles.email}>{JSON.parse(props.user).email}</span>
      <span onClick={() => {
        props.setUser(null);
        localStorage.removeItem('user');
        setShowAlert(true);
      }} className={styles.cornerButton}>Log out</span>
    </li>
  )
  :
  (
    <li className={`${styles.tab} ${styles.account}`}>
      <a className={styles.cornerButton} href="/signin">Sign in</a>
    </li>
  )

  // show to all users
  const tier1 = (
    <Fragment>
      <li className={styles.tab}><a className={props.current === "attendance" ? styles.current : null} href="/attendance">Attendance Form</a></li>
    </Fragment>
  );

  // show to non-exec, signed-in users
  const tier2 = (
    <Fragment>
      <li className={styles.tab}><a className={props.current === "scholarshipprogress" ? styles.current : null} href="/scholarshipprogress">Scholarship Progress</a></li>
    </Fragment>
  );

  // show only to exec users
  const tier3 = (
    <Fragment>
      <li className={styles.tab}><a className={props.current === "execdashboard" ? styles.current : null} href="/execdashboard">Exec Dashboard</a></li>
      <li className={styles.tab}><a className={props.current === "companycontacts" ? styles.current : null} href="/companycontacts">Company Contacts</a></li>
      <li className={styles.tab}><a className={props.current === "statistics" ? styles.current : null} href="/statistics">Statistics</a></li>
    </Fragment>
  );
  
  return (
      <ul className={styles.bar}>
        <a href="/">
         <img src="/logoinvert.png" alt="ACM-W Logo" className={styles.navlogo}/>
        </a>
        {tier1}
        {props.user && tier2}
        {props.user && JSON.parse(props.user).is_exec && tier3}
        {showAlert && !hideAlert && logoutAlert}
        {!(showAlert && !hideAlert) && cornerButton}
      </ul>
  )
}

export default NavBar

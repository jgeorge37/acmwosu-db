import styles from '../styles/components/NavBar.module.css';
import React, {Fragment, useEffect, useState, useRef} from 'react';
import {adaFetch} from '../utility/fetch';

const NavBar = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const subscribed = useRef(false);

  useEffect(() => { return () => subscribed.current = false}, []);

  // Log out confirmation notification
  useEffect(() => {
    if(showAlert) {
      const timer = setTimeout(() => {
        setHideAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Determine if menu must collapse; check if window size or user changes
  useEffect(() => {
    const limit = props.user ? (props.user.is_exec ? 1060 : 670) : 0;
    const isNarrow = window.innerWidth <= limit;
    setNarrow(isNarrow);
    if(!isNarrow) setOpen(false);
  }, [windowWidth, props.user]);

  // Add event listener for window resize
  useEffect(() => {
    const handleResize = ()=> {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoutAlert = (
    <div className={styles.alert}>
      Successfully logged out &#x2705;
    </div>
  )

  const cornerButton = props.user ? 
  (
    <li className={`${styles.tab} ${styles.account}`}>
      <span onClick={() => {
        subscribed.current = true;
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({})
        };
        adaFetch('/api/account/logout', requestOptions).then(() => {
          if(!subscribed.current) return;
          localStorage.removeItem('email');
          props.setUser(null);
          setShowAlert(true);
          subscribed.current = false;
        });
      }} className={styles.cornerButton}>Log out of {props.user.email}</span>
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
    <ul className={narrow ? `${styles.narrow} ${open ? styles.open : styles.closed}` : styles.bar}>
      <div className={styles.mobileTopper}>
        {open && <button onClick={() => setOpen(false)}>&#x2715;</button>}
        {!open && <button onClick={() => setOpen(true)}>&#x2630;</button>}
      </div>
      <a href="/" className={styles.homelink}>
        <img src="/logoinvert.png" alt="ACM-W Logo"/>
        {narrow && <span>ACM-W OSU Database</span>}
      </a>
      <div id={styles.pages}>
        {tier1}
        {props.user && tier2}
        {props.user && props.user.is_exec && tier3}
        {showAlert && !hideAlert && logoutAlert}
        {!(showAlert && !hideAlert) && cornerButton}
      </div>
        
    </ul>
  )
}

export default NavBar

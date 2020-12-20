import styles from '../styles/components/NavBar.module.css';
import React, {useEffect, useState} from 'react';

const NavBar = (props) => {
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);

  useEffect(() => {
    setUser(localStorage.getItem('user'));
  }, []);

  useEffect(() => {
    if(showAlert) {
      const timer = setTimeout(() => {
        setHideAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
      <ul className={styles.bar}>
        <li className={styles.tab}><a className={props.current === "attendance" ? styles.current : null} href="/attendance">Attendance Form</a></li>
        <li className={styles.tab}><a className={props.current === "companycontacts" ? styles.current : null} href="/companycontacts">Company Contacts</a></li>
        <li className={styles.tab}><a className={props.current === "scholarshipprogress" ? styles.current : null} href="/scholarshipprogress">Scholarship Progress</a></li>
        {showAlert && !hideAlert && 
          <div className={styles.alert}>
            Successfully logged out &#x2705;
          </div>
        }
        {user && 
        <li className={`${styles.tab} ${styles.account}`}>
          <span className={styles.email}>{JSON.parse(user).email}</span>
          <span onClick={() => {
            setUser(null);
            localStorage.removeItem('user');
            setShowAlert(true);
          }} className={styles.logout}>Log out</span>
        </li>
        }
      </ul>
  )
}

export default NavBar

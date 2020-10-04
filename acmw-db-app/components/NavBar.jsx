import styles from '../styles/components/NavBar.module.css'

const NavBar = (props) => {

  return (
      <ul className={styles.bar}>
        <li className={styles.tab}><a className={props.current === "attendance" ? styles.current : null} href="/attendance">Attendance Form</a></li>
        <li className={styles.tab}><a className={props.current === "companycontacts" ? styles.current : null} href="/companycontacts">Company Contacts</a></li>
        <li className={styles.tab}><a className={props.current === "scholarshipprogress" ? styles.current : null} href="/scholarshipprogress">Scholarship Progress</a></li>
        <li className={`${styles.tab} ${styles.signin}`}><a href="/signin">Logout</a></li>
      </ul>
  )
}

export default NavBar

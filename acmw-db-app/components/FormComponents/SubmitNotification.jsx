import styles from '../../styles/components/NavBar.module.css';
import {Fragment, useEffect, useState} from 'react';


const SubmitNotification = (props) => {

  useEffect(() => {
    if(props.showNotif) {
      const timer = setTimeout(() => {
        props.setShowNotif(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [props.showNotif]);

  const submitAlert = (
    <div className={styles.alert}>
      Submitted succesfully &#x2705; <button onClick={() => props.setShowNotif(false)}>&#x2716;</button>
    </div>
  )

  return (
    <Fragment>
        {props.showNotif && submitAlert}
    </Fragment>
  )
}

export default SubmitNotification

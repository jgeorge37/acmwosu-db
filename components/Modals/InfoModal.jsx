import React from 'react';
import styles from '../../styles/components/Modal.module.css';

const InfoModal = (props) => {

    return (
        !props.show ? null :
        (
        <div className={styles.modal}>
            <div className={styles.modalBox}>
                <div className={styles.top}>
                    {props.top}
                    <hr></hr>
                </div>
                {props.children}
                <div className={styles.bottomButtons}>
                    <button className={styles.cancelButton} onClick={() => props.setShow(false)}>Close</button>
                </div>
            </div>
        </div>
        )
    )
}

export default InfoModal
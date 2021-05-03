import React from 'react';
import styles from '../../styles/components/Modal.module.css';

const ConfirmModal = (props) => {

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
                    <button className={styles.cancelButton} onClick={() => props.setShow(false)}>Cancel</button>
                    <button className={styles.confirmButton} onClick={() => props.handleSubmit()}>Submit</button>
                </div>
            </div>
        </div>
        )
    )
}

export default ConfirmModal
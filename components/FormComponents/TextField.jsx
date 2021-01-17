import styles from '../../styles/components/FormComponents.module.css'
import React from 'react'

const TextField = (props) => {
    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <input type={props.type ? props.type : "text"} disabled={props.disabled} value={props.value} className={`${styles.field} ${props.disabled && styles.disabled}`} onChange={props.onChange}></input>
            <p className={styles.error}>{props.error}</p>
        </>
    )
}

export default TextField

import styles from '../../styles/components/FormComponents.module.css'
import React from 'react'

const SubmitButton = (props) => {
    return (
        <button className={styles.button} onClick={props.handleChange}>{props.label}</button>
    )
}   

export default SubmitButton 

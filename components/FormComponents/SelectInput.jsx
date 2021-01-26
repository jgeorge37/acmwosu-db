import styles from '../../styles/components/FormComponents.module.css'
import React from 'react'

const SelectInput = (props) => {
    const changeCurrent = (event) => {
        const selectedValue = event.target.value;
        var selectedOption = props.options ? props.options[0] : {}
        if(props.options) {
            props.options.forEach((option) => {
                if(option.label === selectedValue || option.value == selectedValue || 
                    (typeof option.value !== 'undefined' && (option.value).toString() === selectedValue)) {
                    selectedOption = option
                }
            });
        }
        if(props.onChange) props.onChange(selectedOption);
    }

    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <select className={styles.field} onChange={changeCurrent}>
                {props.options.map((option, index) => {
                    return <option key={index} value={option.value || option.value === false ? option.value : option.label}>{option.label}</option>
                })}
            </select>
        </>
    )
}
export default SelectInput

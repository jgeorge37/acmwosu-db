import styles from '../../styles/components/FormComponents.module.css'

const SubmitButton = (props) => {
    return (
        <button className={styles.button} onClick={props.handleChange}>{props.label}</button>
    )
}   

export default SubmitButton 
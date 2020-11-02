import styles from '../../styles/components/FormComponents.module.css'

const TextField = (props) => {
    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <input type="text" disabled={props.disabled} value={props.value} className={`${styles.field} ${props.disabled && styles.disabled}`} onChange={props.onChange}></input>
            <p className={styles.error}>{props.error}</p>
        </>
    )
}

export default TextField

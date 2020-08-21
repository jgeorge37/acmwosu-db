import styles from '../../styles/components/FormComponents.module.css'

const TextField = (props) => {
    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <input type="text" className={styles.field}></input>
        </>
    )
}   

export default TextField
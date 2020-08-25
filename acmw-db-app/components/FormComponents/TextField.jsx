import styles from '../../styles/components/FormComponents.module.css'

const TextField = (props) => {
    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <input type="text" className={styles.field} onChange={props.onChange}></input>
        </>
    )
}   

export default TextField
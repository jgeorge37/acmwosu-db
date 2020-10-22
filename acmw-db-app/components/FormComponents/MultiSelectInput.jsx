import styles from '../../styles/components/FormComponents.module.css'

const MultiSelectInput = (props) => {

    return (
        <div>
            <label className={styles.label}>{props.label}</label>
            <select className={styles.multi} onChange={props.onChange} multiple={true}>
                {props.options.map((value, index) => {
                    return <option key={index}>{value}</option>
                })}
            </select>
        </div>
    )
}

export default MultiSelectInput
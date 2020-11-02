import styles from '../../styles/components/FormComponents.module.css'

const SelectInput = (props) => {
    const changeCurrent = (event) => {
        const selectedLabel = event.target.value;
        var selectedOption = props.options ? props.options[0] : {}
        if(props.options) {
            props.options.forEach((option) => {
                if(option.label === selectedLabel) selectedOption = option;
            });
        }
        props.onChange(selectedOption);
    }

    return (
        <>
            <label className={styles.label}>{props.label}</label>
            <select className={styles.field} onChange={changeCurrent}>
                {props.options.map((option, index) => {
                    return <option key={index}>{option.label}</option>
                })}
            </select>
        </>
    )
}

export default SelectInput
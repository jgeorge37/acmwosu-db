import styles from '../../styles/components/FormComponents.module.css'

const MultiSelectInput = (props) => {

    return (
        <div>
            {props.options.map((value, index) => {
                return (
                    <div>
                        <input type="checkbox" id={value}/>
                        <label for={value}>{value}</label>
                    </div>
                ) 
            })}
        </div>
    )
}

export default MultiSelectInput
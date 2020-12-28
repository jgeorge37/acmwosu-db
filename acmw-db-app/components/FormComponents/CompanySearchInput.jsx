import SelectInput from './SelectInput'
import {useState} from 'react'
import styles from '../../styles/components/FormComponents.module.css'

const getCompanyInfo = async (input) => {
    const url = '/api/company/byString?input=' + input
    const response = await fetch(url, {
        method: 'GET', 
        mode: 'cors', 
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
        'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
    })
    return response.json() 
}

// props.onChange - What happens when a company is selected
const CompanySearchInput = (props) => {

    const [companyList, setCompanyList] = useState([])
    const [isText, setIsText] = useState(false) // Has the user entered text

    const filterFunction = (event) => {
        if (event.target.value) {
            setIsText(true)
            getCompanyInfo(event.target.value).then((data) => {
                const tempList = []
                for (var i in data) {
                    tempList.push({
                        label: data[i]["cname"],
                        value: data[i]["id"]})
                }
                setCompanyList(tempList)
                if (tempList.length > 0) {
                    props.onChange(tempList[0])
                }
            })
        } else {
            setIsText(false)
            setCompanyList([])
            props.onChange({label: null, value: null})
        }
    }

    return (
        <div>
            <label className={styles.label}>Company Search</label>
            <input autoComplete="off" type="text" className={styles.field} placeholder="Search..." id="companySearch" onChange={filterFunction}></input>
            {(companyList.length > 0) && <SelectInput options={companyList} onChange={props.onChange}/>}
            {(isText && companyList.length == 0) && <div><label className={styles.error}>That company does not exist!</label></div>}
        </div>
    )
}

export default CompanySearchInput
import React, {useState, useRef, useEffect} from 'react'
import styles from '../../styles/components/FormComponents.module.css'
import SelectInput from './SelectInput'
import {validateName} from '../../utility/utility'

const getCompanyInfo = async (input) => {
    const url = '/api/company/byString?input=' + input
    const res = await fetch(url, {
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
    const result = await res.json();
    return result;
}

// props.onChange - What happens when a company is selected
const CompanySearchInput = (props) => {
    const subscribed = useRef(false)
    const [companyList, setCompanyList] = useState([])
    const [isText, setIsText] = useState(false) // Has the user entered text

    const filterFunction = (event) => {
        if (validateName(event.target.value)) {
            setIsText(true)
            subscribed.current = true;
            getCompanyInfo(event.target.value).then((data) => {
                const tempList = []
                for (var i in data) {
                    tempList.push({
                        label: data[i]["cname"],
                        value: data[i]["id"]})
                }

                if(!subscribed.current) return;

                setCompanyList(tempList)
                if (tempList.length > 0) {
                    if(props.onChange) props.onChange(tempList[0])
                }
                subscribed.current = false;
            })
        } else {
            setIsText(false)
            setCompanyList([])
            if(props.onChange) props.onChange({label: null, value: null})
        }
    }

    // When component unmounts, subscribed is false which stops async operation from continuing
    useEffect(() => {
        return () => {subscribed.current = false};
    }, []);

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

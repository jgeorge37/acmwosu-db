import {useState, useRef, useEffect} from 'react'
import styles from '../../styles/components/FormComponents.module.css'
import MultiSelectInput from './MultiSelectInput'

// I'm so bad at understanding promises/fetch() so please point out if I'm doing something wrong

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
    const result = await response.json();
    return result;
}

const CompanySearchInput = (props) => {
    const subscribed = useRef(false)
    const [companyList, setCompanyList] = useState([])
    const [isText, setIsText] = useState(false) // Has the user entered text

    const filterFunction = (event) => {
        if (event.target.value) {
            setIsText(true)
            subscribed.current = true;
            getCompanyInfo(event.target.value).then((data) => {
                const tempList = []
                for (var i in data) {
                    tempList.push(data[i]["cname"])
                }
                if(subscribed.current) setCompanyList(tempList)
                subscribed.current = false;
            })
        } else {
            setIsText(false)
            setCompanyList([])
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
            {(companyList.length > 0) && <MultiSelectInput options={companyList} onChange={props.handleMultiSelect}/>}
            {(isText && companyList.length == 0) && <div><label className={styles.error}>That company does not exist!</label></div>}
        </div>
    )
}

export default CompanySearchInput
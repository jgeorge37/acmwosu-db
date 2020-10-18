import {useState, useRef} from 'react'
import styles from '../../styles/components/FormComponents.module.css'
import MultiSelectInput from './MultiSelectInput'
import SelectInput from './SelectInput'
import TextField from './TextField'

const StudentSearch = (props) => {

    const isDotNum = useRef(false);

    const fName = useRef("")
    const lName = useRef("")

    const [hasText, setHasText] = useState(false)
    const [fNameError, setfNameError] = useState("")
    const [lNameError, setlNameError] = useState("")
    const [searchOptions, setSearchOptions] = useState([])

    const getStudentInfo = async () => {
        var query = createQuery()
        const url = '/api/student/search?' + query
        const response = await fetch(url, {method: 'GET'})
        response.json().then((data) => {
            const tempList = []
            for (var i in data) {
                tempList.push(data[i]["fname"] + " " + data[i]["lname"] + " - " + data[i]["name_dot_num"])
            }
            setSearchOptions(tempList)
        })
    }

    const createQuery = () => {
        var query = ""
        if (fName.current.length > 0) {
            query = 'fname=' + fName.current
        }
        if (lName.current.length > 0 && isDotNum.current) {
            query += '&name_dot_num=' + lName.current
        } else if (lName.current.length > 0) {
            query += '&lname='+ lName.current
        }
        return query
    }
    
    const fNameSearch = (event) => {
        const regex = new RegExp(/^[a-zA-Z]+$/)
        if (regex.test(event.target.value)) {
            fName.current = event.target.value
            setfNameError("")
            getStudentInfo()
        } else if (event.target.value) {
            fName.current = ""
            setfNameError("First name must only contain letters!")
        } else {
            fName.current = ""
            if (lName.current.length > 0) {
                getStudentInfo()
            } else {
                setSearchOptions([])
            }
            setfNameError("")
        }
        setHasText(lName.current.length > 0 || fName.current.length > 0)
    }

    const lNameSearch = (event) => {
        const letters = new RegExp(/^[a-zA-Z]+$/)
        const dotNumCheck = new RegExp(/^[a-zA-Z]+\.[1-9][0-9]*$/)
        isDotNum.current = dotNumCheck.test(event.target.value)
        if (letters.test(event.target.value) || isDotNum.current) {
            lName.current = event.target.value
            setlNameError("")
            getStudentInfo()
        } else if (event.target.value) {
            lName.current = ""
            setlNameError("Last name.# is formatted incorrectly!")
        } else {
            lName.current = ""
            if (fName.current.length > 0) {
                getStudentInfo()
            } else {
                setSearchOptions([])
            }
            setlNameError("")
        }
        setHasText(lName.current.length > 0 || fName.current.length > 0)
    }

    return (
        <div>
            <h2>Student Search</h2>
            <TextField label='First Name' onChange={fNameSearch} error={fNameError}/>
            <TextField label='Last Name (.# Optional)' onChange={lNameSearch} error={lNameError}/>
            {searchOptions.length > 0 && <SelectInput label='Choose Student' options={searchOptions} onChange={props.selectStudent}/>}
            {searchOptions.length <= 0 && hasText && <p>Unable to find student</p>}
        </div>
    )
}

export default StudentSearch
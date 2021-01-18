import {useState, useRef, useEffect} from 'react'
import styles from '../../styles/components/FormComponents.module.css'
import MultiSelectInput from './MultiSelectInput'
import SelectInput from './SelectInput'
import TextField from './TextField'
import {validateName, validateLastNameDotNum} from '../../utility/utility';
import React from 'react'

const StudentSearch = (props) => {
    const subscribed = useRef(false);
    const isDotNum = useRef(false);

    const fName = useRef("");
    const lName = useRef("");
    const [fNameError, setfNameError] = useState("")
    const [lNameError, setlNameError] = useState("")

    const [hasText, setHasText] = useState(false);
    const [searchOptions, setSearchOptions] = useState([]);

    // prevent async update if unmounted
    useEffect(() => {return () => {subscribed.current = false}}, []);

    const getStudentInfo = async () => {
        subscribed.current = true;
        var query = createQuery()
        const url = '/api/student/search?' + query
        const res = await fetch(url, {method: 'GET'})
        res.json().then((data) => {
            const tempList = []
            for (var i in data) {
                tempList.push({
                    label: data[i]["fname"] + " " + data[i]["lname"] + " - " + data[i]["name_dot_num"],
                    value: data[i]["id"]
                });
            }
            if(!subscribed.current) return;
            setSearchOptions(tempList)
            if (tempList.length > 0) {
              props.selectStudent({fname: data[0]["fname"], name_dot_num: data[0]["name_dot_num"], student_id: data[0]["id"]}) // autoselects the first student in the list
            }
            subscribed.current = false;
        })
    }

    const handleSelectStudent = (e) => {
      let id = e.value;
      const studentInfo = {fname: "Cornelius", name_dot_num: "Doge.420", student_id: id} // we don't want corn dog
      for (var i in searchOptions) {
        if (searchOptions[i].value === id) {
          studentInfo.fname = searchOptions[i].label.split(" ")[0]
          studentInfo.name_dot_num = searchOptions[i].label.split(" - ")[1]
          break
        }
      }
      props.selectStudent(studentInfo)
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
        if (validateName(event.target.value)) {
            fName.current = event.target.value
            setfNameError("")
            getStudentInfo()
        } else if (event.target.value) {
            fName.current = ""
            setfNameError("First name must have at least one character!")
        } else {
            fName.current = ""
            if (lName.current.length > 0) {
                getStudentInfo()
            } else {
                setSearchOptions([])
                props.selectStudent() //protection when deleting
            }
            setfNameError("")
        }
        setHasText(lName.current.length > 0 || fName.current.length > 0)
    }

    const lNameSearch = (event) => {
        isDotNum.current = validateLastNameDotNum(event.target.value)
        if (validateName(event.target.value) || isDotNum.current) {
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
                props.selectStudent() //protection when deleting
            }
            setlNameError("")
        }
        setHasText(lName.current.length > 0 || fName.current.length > 0)
    }

    return (
        <div>
            <h3>Student Search</h3>
            <TextField label='First Name' onChange={fNameSearch} error={fNameError}/>
            <TextField label='Last Name (.# Optional)' onChange={lNameSearch} error={lNameError}/>
            {searchOptions.length > 0 && <SelectInput label='Choose Student' options={searchOptions} onChange={handleSelectStudent}/>}
            {searchOptions.length <= 0 && hasText && <p>Unable to find student</p>}
        </div>
    )
}

export default StudentSearch

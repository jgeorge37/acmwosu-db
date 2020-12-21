import {useState, useRef, useEffect} from 'react'
import SelectInput from './FormComponents/SelectInput'
import SubmitButton from './FormComponents/SubmitButton'

const SelectMeeting = (props) => {

    const [meetingList, setMeetingList] = useState([])

    // There is probably a less clunky way to do this w/o having a button, but
    // otherwise there were issues when the parent component triggered a rerender of this component
    // when a meeting had been set

    const getMeetings = async () => {
        const url = '/api/meeting/meeting-list'
        const response = await fetch(url, {method: 'GET'})
        response.json().then((data) => {
            const tempList = []
            for (var i in data) {
                const date = new Date(data[i]["meeting_date"])
                tempList.push({
                    label: data[i]["meeting_name"] + " - " + (date.getMonth()+ 1) + "/" + date.getDate() + "/" + date.getFullYear(),
                    value: data[i]["id"]
                })
            }
            setMeetingList(tempList)
            props.selectMeeting(tempList.length > 0 && tempList[0])
        })
    }

    return (
        <div>
            {meetingList.length == 0 && <SubmitButton label="Select Meeting" handleChange={getMeetings}/>}
            {meetingList.length > 0 && <SelectInput options={meetingList} label="Select Meeting" onChange={props.selectMeeting}/>}
        </div>
    )
}

export default SelectMeeting
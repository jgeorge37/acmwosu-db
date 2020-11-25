import {useState, useRef, useEffect} from 'react'
import SelectInput from './FormComponents/SelectInput'

const SelectMeeting = (props) => {

    const [meetingList, setMeetingList] = useState([])
    const [attendees, setAttendees] = useState([])
    const meetingId = useRef()

    useEffect(() => {
        getMeetings()
    })

    const getMeetings = async () => {
        const url = '/api/meeting/meeting-list'
        const response = await fetch(url, {method: 'GET'})
        response.json().then((data) => {
            const tempList = []
            for (var i in data) {
                const date = new Date(data[i]["meeting_date"])
                tempList.push({
                    label: data[i]["meeting_name"] + " - " + (date.getMonth()+ 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + data[i]["id"],
                    value: data[i]["id"]
                })
            }
            setMeetingList(tempList)
            // props.selectMeeting(tempList.length > 0 && tempList[0])
        })
    }

    const getAttendees = async (meeting) => {

        if (meeting) {
            console.log(meeting.value)
            const url = '/api/meeting/meeting-attendance?meetingId=' + meeting.value
            const response = await fetch(url, {method: 'GET'})
            response.json().then((data) => {
                const tempList = []
                for (var i in data) {
                    tempList.push(data[i]["fname"] + " " + data[i]["lname"])
                }
                setAttendees(tempList)
            })
        } else {
            const tempList = ["There were no attendees at this meeting."]
            setAttendees([tempList])
        }
    }

    return (
        <div>
            <SelectInput options={meetingList} label="Select Meeting" onChange={getAttendees}/>
            <p>{attendees.map((attendee, index)=> {
                return (<li key={index}>{attendee}</li>)
            })}</p>
        </div>
    )
}

export default SelectMeeting
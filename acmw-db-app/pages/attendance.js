import AttendanceForm from '../components/AttendanceForm'
import NavBar from '../components/NavBar'

const Attendance = () => {
    return (
        <div>
            <NavBar current="attendanceform"/>
            <AttendanceForm />
        </div>
    )
}

export default Attendance

import React, { useState, useEffect, useRef } from 'react';
import AttendanceFormCard from './AttendanceFormCard';
import Alert from 'react-bootstrap/Alert';

const AttendanceFormV2 = (props) => {
  const [success, setSuccess] = useState(false);

  return <div className="att-wrapper">
    <h1 >Attendance form</h1>
    {
      success ? 
      <Alert className="success-alert" variant="success">
        Submitted successfully, thank you!
      </Alert>
      :
        <AttendanceFormCard className="att-card" setSuccess={setSuccess}/>
    }
    <style jsx="true">{`
      .att-wrapper h1 {
        text-align: center;
        font-size: 2.5em;
        margin-bottom: 15px;
      }
      .att-wrapper p {
        text-align: center;
        font-size: 25px;
      }
      .att-wrapper {
        margin-bottom: 15px;
      }
      .success-alert {
        max-width: 600px;
        margin: auto;
      }
    `}</style>
  </div>
}

export default AttendanceFormV2;

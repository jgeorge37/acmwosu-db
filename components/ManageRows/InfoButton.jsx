import React from 'react';
import {useState, useRef, useEffect} from 'react';
import InfoModal from '../Modals/InfoModal';
import styles from '../../styles/components/ManageRows.module.css';

const InfoButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [body, setBody] = useState(null);
  const [error, setError] = useState(null);
  const subscribed = useRef(false);

  const assembleBody = (responseBody) => {
    const personal_email = responseBody.personal_email ? responseBody.personal_email : 'not found';
    const school_level = responseBody.school_level ? responseBody.school_level : 'not found';
    const meetings = responseBody.meetings ? 
      (<ul>{responseBody.meetings.map((m) => <li>{m.semester}, {m.meeting_date}, {m.meeting_name}</li>)}</ul>)
      : 'none';

    const bodyString = (
      <>
        <p><b>Personal email:</b> {personal_email}</p>
        <p><b>School level:</b> {school_level}</p>
        <p><b>All meetings attended:</b></p>
          {meetings}
      </>
    );
    setBody(bodyString);
  }

  const handleInfo = () => {
    subscribed.current = true;
    const url = `/api/student/details?id=${props.id}`;
    fetch(url, {method: 'GET'}).then((response) => {
      if (!subscribed.current) return;
      if (response.ok) {
        return response.json();
      } else {
        throw("ERROR");
      }
    })
    .then((resJson) => {
      assembleBody(resJson);
      setError(null);
      setShowModal(true);
    })
    .catch((error) => {
      setBody(null);
      setError(error);
    });
  }

  useEffect(() => {return () => {subscribed.current = false}}, []);

  useEffect(() => {
    if (!showModal) {
      setBody(null);
      setError(null);
    }
  }, [showModal]);

  return (
    <>
    <button className={styles.actionButton + " " + styles.infoButton} onClick={() => handleInfo()}>
        &#x1F6C8;
    </button>
    <InfoModal show={showModal} setShow={setShowModal} top={`Details for ${props.name}`}>
      {body ? body : ''}
      {error ? <p>{error}</p> : ''}  
    </InfoModal>
    </>
  )

}

export default InfoButton;
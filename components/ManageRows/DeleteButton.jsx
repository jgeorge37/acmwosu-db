import React from 'react';
import {useState, useRef, useEffect} from 'react';
import ConfirmModal from '../FormComponents/ConfirmModal';
import styles from '../../styles/components/ManageRows.module.css';

const DeleteButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const subscribed = useRef(false);

  const handleDelete = () => {
    subscribed.current = true;
    const url = `/api/student/byId?id=${props.id}`;
    fetch(url, {method: 'DELETE'}).then((response) => {
      if (!subscribed.current) return;
      if (response.ok) {
        props.refreshFxn();
        setShowModal(false);
      } else {
        setError("ERROR");
      }
    });
  }

  useEffect(() => {return () => {subscribed.current = false}}, []);

  return (
    <>
    <button className={styles.actionButton + " " + styles.deleteButton} onClick={() => setShowModal(true)}>
      &#x2716;
    </button>
    <ConfirmModal show={showModal} setShow={setShowModal} top="Confirm delete" handleSubmit={handleDelete}>
      <p>A student entry should only be deleted if it was created incorrectly or only used in testing. 
        Deletion will destroy the student information, attendance data for the student, and GHC data and account for the student if applicable.
        Please confirm deletion of <i>{props.name}</i> from the database.</p>
      {error ? <p>{error}</p> : ''}  
    </ConfirmModal>
    </>
  )

}

export default DeleteButton;
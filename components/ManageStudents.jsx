import styles from '../styles/components/ManageAccounts.module.css';
import {currentAcademicYear} from '../utility/utility';
import {useEffect, useRef, useState} from 'react';
import React from 'react'

const LIMIT = 10;

const StudentRow = (props) => {
  return (
    <tr className={styles.listRow}>
      <td>{props.fname}</td>
      <td>{props.nameDotNum}</td>
      <td>{props.fall}</td>
      <td>{props.spring}</td>
    </tr>
  )
}

const ManageStudents = (props) => {
  const subscribed = useRef(false);
  const [offset, setOffset] = useState(0);
  const totalCount = useRef(null);
  const [students, setStudents] = useState([]);
  const [fall, spring] = currentAcademicYear();

  const getStudents = async () => {
    subscribed.current = true;
    const url = `/api/student/list?limit=${LIMIT}&offset=${offset}&fall=${fall}&spring=${spring}`;
    const res = await fetch(url, {method: 'GET'});
    const response = await res.json();
    if(!subscribed.current) return;
    totalCount.current = response.totalCount;
    setStudents(response.studentRows);
    subscribed.current = false;
  }

  useEffect(() => {
    getStudents();
    return () => {subscribed.current = false};
  }, [offset]);

  const pageLeft = (
    <button 
      disabled={offset === 0}
      onClick={() => {setOffset(offset - LIMIT)}}
    >{"<"}</button>
  )

  const pageRight = (
    <button 
      disabled={offset + LIMIT >= totalCount.current}
      onClick={() => {setOffset(offset + LIMIT)}}
    >{">"}</button>
  )

  return (
    <div>
      <h2>Manage students</h2>
      <div className={styles.listContainer}>
        <table>
          <thead><tr>
            <th>First name</th>
            <th>Name dot number</th>
            <th>{fall}</th>
            <th>{spring}</th>
          </tr></thead>
          <tbody>
          {students.map((acc) => 
            <StudentRow 
              fname={acc.fname} 
              nameDotNum={acc.name_dot_num}
              fall={acc[fall]}
              spring={acc[spring]}
              key={acc.id}
            />
          )}
          </tbody>
        </table>
        <div className={styles.pageButtons}>{pageLeft} 
          Page {offset/LIMIT + 1} / {Math.ceil(totalCount.current/LIMIT)}
        {pageRight}</div>
      </div>
    </div>
  )
}

export default ManageStudents
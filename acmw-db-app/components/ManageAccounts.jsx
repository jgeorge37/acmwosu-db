import styles from '../styles/components/ManageAccounts.module.css';
import {useEffect, useRef, useState} from 'react';
import {adaFetch} from '../utility/fetch';

const LIMIT = 10;

const AccountRow = (props) => {
  return (
    <tr className={styles.listRow}>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>{props.permission}</td>
    </tr>
  )
}

const ManageAccounts = (props) => {
  const subscribed = useRef(false);
  const [offset, setOffset] = useState(0);
  const totalCount = useRef(null);
  const [accounts, setAccounts] = useState([]);

  const getAccounts = async () => {
    subscribed.current = true;
    const url = `/api/account/list?limit=${LIMIT}&offset=${offset}`;
    const response = await adaFetch(url, {method: 'GET'});
    if(!subscribed.current) return;
    totalCount.current = response.totalCount;
    setAccounts(response.accountRows);
    subscribed.current = false;
  }

  useEffect(() => {
    getAccounts();
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
      <h2>Manage accounts</h2>
      <div className={styles.listContainer}>
        <table>
          <thead><tr>
            <th>Name</th>
            <th>Email</th>
            <th>Permissions</th>
          </tr></thead>
          <tbody>
          {accounts.map((acc) => 
            <AccountRow 
              name={`${acc.fname} ${acc.lname}`} 
              email={acc.email}
              permission={acc.is_exec ? "Exec" : "GHC"}
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

export default ManageAccounts
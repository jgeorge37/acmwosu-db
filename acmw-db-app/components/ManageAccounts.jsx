import styles from '../styles/components/ManageAccounts.module.css';

const AccountRow = (props) => {
  return (
    <tr className={styles.listRow}>
      <td>{props.name}</td>
      <td>{props.email}</td>
    </tr>
  )
}

const ManageAccounts = (props) => {

  const pageLeft = (
    <button onClick={() => console.log("left")}>{"<"}</button>
  )

  const pageRight = (
    <button onClick={() => console.log("right")}>{">"}</button>
  )

  return (
    <div>
      <h2>Manage accounts</h2>
      <div className={styles.listContainer}>
        <table>
          <thead><tr>
            <th>Name</th>
            <th>Email</th>
          </tr></thead>
          <tbody>
          <AccountRow name="Jing George" email="george.921@osu.edu"/>
          </tbody>
          
        </table>
        <div className={styles.pageButtons}>{pageLeft} 10 / page {pageRight}</div>
      </div>
    </div>
  )
}

export default ManageAccounts
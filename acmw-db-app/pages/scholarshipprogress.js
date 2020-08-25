import Head from 'next/head'
import styles from '../styles/Database.module.css'
import bar_styles from '../styles/components/ScholarshipProgressBar.module.css'
import {useState} from 'react'
import ScholarshipProgressBar from '../components/ScholarshipProgressBar'

const ScholarshipProgress = () => {

    const testOtherScholarshipData = { completed: 100 };

    const testVolunteerHourData = { completed: 75 };

    const testMeetingNumberData = { completed: 60 };

    let rows = [
        { id: 1, remainder: '1/1', dets: 'AnitaB Scholarship: 4/22', },
        { id: 2, remainder: '1/1', dets: 'CTG Volunteer: 1/9', }
      ];
    let columns = [
        { accessor: 'remainder', label: 'Remaining #', priorityLevel: 1, position: 1, minWidth: 150, },
        { accessor: 'dets', label: 'List Details', priorityLevel: 2, position: 2, minWidth: 150, },
      ];

    const testScholarshipList = ['External Scholarship: AnitaB'];

    const testVolunteeringList = ['Engineering Expo 9/10 (1 hour)','Cool Tech Girls 9/26 (2 hours)'];

    const testMeetingList = ['ACM-W Meeting 9/2','ACM-W Meeting 9/9','ACM-W Meeting 9/16','ACM-W Meeting 9/23','ACM-W Meeting 9/30','ACM-W Meeting 10/7'];

      const testScholarshipListItems = testScholarshipList.map((testScholarshipList) =>
        <li>{testScholarshipList}</li>);

      const testVolunteerItems = testVolunteeringList.map((testVolunteeringList) =>
        <li>{testVolunteeringList}</li>);
      
     const testMeetingItems = testMeetingList.map((testMeetingList) =>
     <li>{testMeetingList}</li>);



    return (
        <div className={styles.container}>
            <Head>
                <title>GHC Scholarship Progress</title>
            </Head>
            <h1 className={styles.header}>GHC Scholarship Progress Page</h1>
            <main className={styles.main}>
                <div>
                    <div id={bar_styles.popup_inner}>
                        <table id={bar_styles.table_rows}>
                            <tr>
                                <th>Requirement Category</th>
                                <th>% Done</th>
                                <th>Details</th>
                            </tr>
                            <tr>
                                <td>Other Scholarship</td>
                                <td><ScholarshipProgressBar completed={testOtherScholarshipData.completed}/></td>
                                <td>
                                    <div className={bar_styles.list_scroll}>{testScholarshipListItems}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>Volunteer Hours</td>
                                <td><ScholarshipProgressBar completed={testVolunteerHourData.completed}/></td>
                                <td>
                                    <div className={bar_styles.list_scroll}>{testVolunteerItems}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>ACM-W Meetings</td>
                                <td><ScholarshipProgressBar completed={testMeetingNumberData.completed}/></td>
                                <td>
                                    <div className={bar_styles.list_scroll}>{testMeetingItems}</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ScholarshipProgress
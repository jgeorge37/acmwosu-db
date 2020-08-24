import Head from 'next/head'
import styles from '../styles/Database.module.css'
import {useState} from 'react'
import ScholarshipProgressBar from '../components/ScholarshipProgressBar'
// import ProgressBar from 'react-bootstrap/ProgressBar'

const ScholarshipProgress = () => {

    const testOtherScholarshipData = { completed: 100 };

    const testVolunteerHourData = { completed: 30 };

    const testMeetingNumberData = { completed: 53 };

    return (
        <div className={styles.container}>
            <Head>
                <title>GHC Scholarship Progress</title>
            </Head>
            <h1 className={styles.header}>GHC Scholarship Progress Page</h1>
            <main className={styles.main}>
                <div>
                    <div className={styles.popup_inner}>
                        <table>
                            <tr>
                                <th>Requirement Category</th>
                                <th>% Done</th>
                            </tr>
                            <tr>
                                <td>Other Scholarship</td>
                                <td><ScholarshipProgressBar completed={testOtherScholarshipData.completed}/></td>
                            </tr>
                            <tr>
                                <td>Volunteer Hours</td>
                                <td><ScholarshipProgressBar completed={testVolunteerHourData.completed}/></td>
                            </tr>
                            <tr>
                                <td>ACM-W Meetings</td>
                                <td><ScholarshipProgressBar completed={testMeetingNumberData.completed}/></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ScholarshipProgress
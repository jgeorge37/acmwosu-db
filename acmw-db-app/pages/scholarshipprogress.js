import Head from 'next/head'
import styles from '../styles/Database.module.css'
import progress_styles from '../styles/components/ScholarshipProgressBar.module.css'
import {useState, useEffect} from 'react'
import ScholarshipProgressBar from '../components/ScholarshipProgressBar'

const ScholarshipProgress = () => {

    // can be easily changed if scholarship requirements change
    const requiredAmountForExternalScholarship = 1;
    const requiredAmountForVolunteerHours = 4;
    const requiredAmountForMeetings = 10;
    const requiredAmountForSemester = 5;

    // For future, these will be passed in from Admin input

    // Milly: my thoughts on how to implement on admin/backend side to
    // work with this to be choose: category, amount (either: single-scholarship, hours, or single-meeting),
    // and string comment of details like the date and have that passed into corresponding list
    // then the progress calculated from the inputted amount matched to category

    // We'll need to make sure to current user logged will be passed in
    const currentUserEmail = 'miskus.1@osu.edu';
    const [fallMeetings, setFallMeetings] = useState(0);
    const [springMeetings, setSpringMeetings] = useState(0);
    const [hasExternalScholarship, setExternalScholarship] = useState(false);

    useEffect(() => {
        const fetchMeetingData = async () => {
            const requestOptions = {
                method: 'GET',
            };
            const api = '/api/meeting/account-attendance?email=' + currentUserEmail;
            const res = await fetch(api, requestOptions);
            const result = await res.json();
            for (var i = 0; i < result.length; i++) {
                if (result[i].semester.indexOf("AU") >= 0) {
                    setFallMeetings(result[i].count)
                } else {
                    setSpringMeetings(result[i].count)
                }
            }
        }
        const fetchExternalScholarshipData = async () => {
            const requestOptions = {
                method: 'GET',
            };
            console.log("fetching scholarship data")
            const api = '/api/ghc/check-external-scholarship?email=' + currentUserEmail;
            const res = await fetch(api, requestOptions);
            const result = await res.json();
            setExternalScholarship(result);
        }
        fetchMeetingData()
        fetchExternalScholarshipData()
    }, [])

    // pass in string of details, added to list
    const testScholarshipList = ['External Scholarship: AnitaB'];

    // pass in string of details (key) and corresponding hours (value), appended to dictionary
    const testVolunteeringList = {'Engineering Expo 9/10 (1 hour)': 1,'Cool Tech Girls 9/26 (2 hours)': 2};

    // pass in string of details, added to list
    const testMeetingList = ['ACM-W Meeting 9/2','ACM-W Meeting 9/9','ACM-W Meeting 9/16','ACM-W Meeting 9/23','ACM-W Meeting 9/30','ACM-W Meeting 10/7'];


    function calculateExternalScholarshipProgress(testScholarshipList, requiredAmountForExternalScholarship) {
        let percentExternScholarship = (testScholarshipList.length / requiredAmountForExternalScholarship) * 100;
        return percentExternScholarship;
    }

    function calculateVolunteerProgress(testVolunteeringList, requiredAmountForVolunteerHours) {
        let hours = 0;
        // looping through dictionary of volunteer hours for summation
        for(let key in testVolunteeringList){
            hours = hours + testVolunteeringList[key];
          }
        let percentVolunteerHours = (hours / requiredAmountForVolunteerHours) * 100;
        return percentVolunteerHours;
    }

    function calculateMeetingProgress(numMeetings, requiredAmountForMeetings) {
        // let percentMeetings = (testMeetingList.length / requiredAmountForMeetings) * 100;
        let percentMeetings = (numMeetings / requiredAmountForMeetings) * 100;
        return percentMeetings;
    }

    // Creating consts to set up lists of completed items for user details
    const testScholarshipItems = testScholarshipList.map((testScholarshipList, index) =>
        <li key={index}>{testScholarshipList}</li>);

    // need to only map the keys since those hold the string details
    const testVolunteerItems = Object.keys(testVolunteeringList).map((testVolunteeringList, index) =>
        <li key={index}>{testVolunteeringList}</li>);

    const testMeetingItems = testMeetingList.map((testMeetingList, index) =>
     <li key={index}>{testMeetingList}</li>);


    return (
        <div className={styles.container}>
            <Head>
                <title>GHC Scholarship Progress</title>
            </Head>
            <h1 className={styles.header}>GHC Scholarship Progress Page</h1>
            <main className={styles.main}>
                <div>
                    <div id={progress_styles.popup_inner}>
                        <table id={progress_styles.table_rows}>
                            <thead>
                                <tr>
                                    <th>Requirement Category</th>
                                    <th>% Done</th>
                                    <th>Details</th>
                                </tr>
                                <tr>
                                    <td>Other Scholarship</td>
                                    {/* <td><ScholarshipProgressBar completed={calculateExternalScholarshipProgress(testScholarshipList, requiredAmountForExternalScholarship)}/></td> */}
                                    <td><ScholarshipProgressBar completed={hasExternalScholarship ? 100 : 0}/></td>
                                    <td>
                                        <div className={progress_styles.list_scroll}>{testScholarshipItems}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Volunteer Hours</td>
                                    <td><ScholarshipProgressBar completed={calculateVolunteerProgress(testVolunteeringList, requiredAmountForVolunteerHours)}/></td>
                                    <td>
                                        <div className={progress_styles.list_scroll}>{testVolunteerItems}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>ACM-W Meetings Fall: {fallMeetings} attended</td>
                                    <td><ScholarshipProgressBar completed={calculateMeetingProgress(fallMeetings, requiredAmountForSemester)}/></td>
                                    <td>
                                        <div className={progress_styles.list_scroll}>{testMeetingItems}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>ACM-W Meetings Spring: {springMeetings} attended</td>
                                    <td><ScholarshipProgressBar completed={calculateMeetingProgress(springMeetings, requiredAmountForSemester)}/></td>
                                    <td>
                                        <div className={progress_styles.list_scroll}>{testMeetingItems}</div>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ScholarshipProgress

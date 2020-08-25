import styles from '../styles/components/ScholarshipProgressBar.module.css'

const ScholarshipProgressBar = (props) => {

    // const ProgressBar = (props) => {
        const { completed } = props;
      
        const fillerStyles = {
          height: '100%',
          width: `${completed}%`,
          backgroundColor: 	'#9932CC',
          borderRadius: 'inherit',
          textAlign: 'right'
        }
      
        
      
        return (
          <div className={styles.container_styles}>
            <div style={fillerStyles}>
              <span className={styles.label_styles}>{`${completed}%`}</span>
            </div>
          </div>
        )
    //   };

    // return (
    //     <div>
    //         <div className={styles.popup_inner}>
    //             <table>
    //                 <tr>
    //                     <th>Requirement Category</th>
    //                     <th>% Done</th>
    //                     {/* <th><ProgressBarContainer/></th> */}
    //                 </tr>
    //                 <tr>
    //                     <td>Other Scholarship</td>
    //                     <td><ProgressBar completed={props.otherScholarshipProgress}/></td>
    //                 </tr>
    //                 <tr>
    //                     <td>Volunteer Hours</td>
    //                     <td><ProgressBar completed={props.volunteerHoursProgress}/></td>
    //                 </tr>
    //                 <tr>
    //                     <td>ACM-W Meetings</td>
    //                     <td><ProgressBar completed={props.meetingNumberProgress}/></td>
    //                 </tr>
    //             </table>
    //     </div>
    // </div>
    // )
}

export default ScholarshipProgressBar
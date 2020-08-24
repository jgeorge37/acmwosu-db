
const ScholarshipProgressBar = (props) => {

    // const ProgressBar = (props) => {
        const { completed } = props;
      
        const containerStyles = {
          height: 20,
          width: '100%',
          backgroundColor: "#e0e0de",
          borderRadius: 50,
          margin: 50
        }
      
        const fillerStyles = {
          height: '100%',
          width: `${completed}%`,
          backgroundColor: 	'#9932CC',
          borderRadius: 'inherit',
          textAlign: 'right'
        }
      
        const labelStyles = {
          padding: 5,
          color: 'white',
          fontWeight: 'bold'
        }
      
        return (
          <div style={containerStyles}>
            <div style={fillerStyles}>
              <span style={labelStyles}>{`${completed}%`}</span>
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
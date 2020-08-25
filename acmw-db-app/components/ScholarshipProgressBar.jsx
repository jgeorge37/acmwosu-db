import styles from '../styles/components/ScholarshipProgressBar.module.css'

const ScholarshipProgressBar = (props) => {
        // completed % is passed in from scholarshipprogress.js
        const { completed } = props;
        // this is the style used to fill in the progress bar
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
}

export default ScholarshipProgressBar
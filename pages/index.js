import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

const Home = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ACM-W Database</title>
      </Head>
      <main className={styles.main}>
        
        <h1 className={styles.title}>
          ACM-W OSU Database
        </h1>

        <div className={styles.grid}>
          <a href="/attendance" className={styles.card} id={styles.specialCard}>
            <h3>Event attendance form &rarr;</h3>
            <p>Record your attendance at one of our meetings</p>
          </a>
          <a target="_blank" href="https://acmwosu.github.io/" className={styles.card}>
              <h3>Information site &rarr;</h3>
              <p>Learn more about Ohio State's ACM-W chapter</p>
          </a>
          <a target="_blank" href='https://calendar.google.com/calendar/u/1?cid=YWNtd29zdUBnbWFpbC5jb20' className={styles.card}>
            <h3>Google calendar &rarr;</h3>
            <p>Add ACM-W OSU's events calendar to your Google account</p>
          </a>
          <a target="_blank" href='https://airtable.com' className={styles.card}>
            <h3>Executive console &rarr;</h3>
            <p>Sign into Airtable to manage meeting and attendee data</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Created by members of the ACM-W OSU 2020-2021 Executive Board with Next.js and Airtable.</p>
      </footer>
    </div>
  )
}
export default Home

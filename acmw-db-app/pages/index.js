import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ACM-W Database</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          ACM-W OSU Database
        </h1>

        <p className={styles.description}>
          Learn more about The Ohio State University's Association of Computing Machinery - Women's Chapter at 
          our <a target="_blank" href="https://acmwosu.github.io/">information site</a>.
        </p>

        <div className={styles.grid}>
          <a href="/attendance" className={styles.card}>
            <h3>Event attendance form &rarr;</h3>
            <p>Record your attendance at one of our meetings</p>
          </a>

          <a href="/signin" className={styles.card}>
            <h3>GHC scholarship progress &rarr;</h3>
            <p>For GHC scholarship recipients: view your progress on the scholarship requirements</p>
          </a>

          <a href="/signin" className={styles.card}>
            <h3>Exec login &rarr;</h3>
            <p>For ACM-W executive board members: access executive features</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Created by members of the ACM-W OSU 2020-2021 Executive Board with React, Node.js, and PostgreSQL - 
          view our code <a target="_blank" href="https://github.com/jgeorge37/acmwosu-db">here</a>!</p>
      </footer>
    </div>
  )
}

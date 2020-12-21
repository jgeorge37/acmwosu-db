import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import React, { useEffect, useState } from 'react';

const averageURL = '/api/meeting/average-attendance';

const get_avg = async averageURL => {
  try {
    const response = await fetch(averageURL, {method: 'GET'});
    return await response.text();
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

const Statistics = () => {
  const [average, setAverage] = useState("");

  useEffect(() => {
    let subscribed = true;
    get_avg(averageURL).then(val => {
      if (subscribed) setAverage(val);
      subscribed = false;
    });
    return () => {subscribed = false};
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Statistics</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
        <h1>Statistics</h1>  
        <h2>Average Meeting Attendance</h2>
        {average}
        </div>
      </main>
    </div>
  )
}

export default Statistics 
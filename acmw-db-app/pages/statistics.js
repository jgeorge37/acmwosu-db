import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import React, { useState } from 'react';

const averageURL = '/api/meeting/average-attendance';

const get_data = async averageURL => {
  try {
    const response = await fetch(averageURL, {method: 'GET'});
    return await response.text();
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

const Statistics = () => {
  const[average, setAverage]=
  useState("");
  get_data(averageURL).then(val => {setAverage(val)});
    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Database Statistics</title>
            </Head>

            <main className={styles.main}>
                <div className={styles.card}>
                <h1> ACM-W Database Statistics</h1>  
                <h2>Average Meeting Attendence</h2>
                {get_data(averageURL)}
                </div>
            </main>
        </div>
    )
}

export default Statistics
import Head from 'next/head';
import styles from '../styles/SignIn.module.css';
import React, { useState } from 'react';

const url = '/api/meeting/average-attendance';
const fetch = require("node-fetch");


const get_data = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};

const Statistics = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>ACM-W Database Statistics</title>
            </Head>

            <main className={styles.main}>
                <div className={styles.card}>
                <h1> ACM-W Database Statistics</h1>  
                <h2>Average Meeting Attendence</h2>
                {get_data(url)}
                </div>
            </main>
        </div>
    )
}

export default Statistics
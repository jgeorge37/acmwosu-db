import '../styles/globals.css';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import React, { useEffect, useState, useRef } from 'react';

const loadingWheel = (
  <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
);

const accountOnly = ['scholarshipprogress'];
const execOnly = ['execdashboard', 'companycontacts'];

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [blocked, setBlocked] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // occasionally it's the literal string "undefined"
    setUser(storedUser === "undefined" ? null : storedUser);
    const pageName = Component.name.toLowerCase();
    setCurrentPage(pageName);
    checkBlocked(pageName, storedUser === "undefined" ? null : storedUser)
  });

  // check if user is unauthorized
  const checkBlocked = (pageName, user) => {
    let blocked = null;
    console.log("user: " + user);
    console.log(user ? "true user" : "false user");
    if(accountOnly.includes(pageName)) {
      blocked = user ? false : true;
    } else if(execOnly.includes(pageName)) {
      blocked = user && JSON.parse(user).is_exec ? false : true;
    } else {
      blocked = false;
    }
    console.log("page: " + pageName);
    console.log("blocked: " + blocked);
    setBlocked(blocked);
  }

  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="app-container">
        <div className="navbar">
          <NavBar current={currentPage} user={user} setUser={setUser}></NavBar>
        </div>
        <div className="component">
          { blocked === null && loadingWheel }
          { blocked === false &&
            <Component {...pageProps} />
          }
          { blocked === true &&
            <div className="unauth">You are not authorized to access this page. <br/><a href="/signin">Sign in</a></div>
          }
        </div>
      </div>
    </div>
   );
}

export default MyApp

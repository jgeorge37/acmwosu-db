import '../styles/globals.css';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import React, { useEffect, useState } from 'react';

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
    setBlocked(null);
    const userFromStorage = localStorage.getItem('user');
    setUser(userFromStorage);
    const pageName = Component.name.toLowerCase();
    setCurrentPage(pageName);
  }, [Component]);

  // check if user is unauthorized
  const checkBlocked = async () => {
    const pageName = Component.name.toLowerCase();
    let blocked = null;
    if(accountOnly.includes(pageName)) {
      blocked = !!user ? false : true;
    } else if(execOnly.includes(pageName)) {
      blocked = !!user && JSON.parse(user).is_exec ? false : true;
    } else {
      blocked = false;
    }
    return blocked;
  }
  checkBlocked().then(val => setBlocked(val));

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

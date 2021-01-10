import '../styles/globals.css';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import React, { useEffect, useState, Fragment } from 'react';

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
    const pageName = window.location.pathname.substring(1);
    setCurrentPage(pageName);
    checkBlocked(pageName, storedUser === "undefined" ? null : storedUser)
  });

  // check if user is unauthorized
  const checkBlocked = (pageName, user) => {
    let blocked = null;
    if(accountOnly.includes(pageName)) {
      blocked = user ? false : true;
    } else if(execOnly.includes(pageName)) {
      blocked = user && JSON.parse(user).is_exec ? false : true;
    } else {
      blocked = false;
    }
    setBlocked(blocked);
  }

  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logorainbow.png" />
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
            <div className="unauth">You are not authorized to access this page. 
            { !(user && !JSON.parse(user).is_exec) &&
              <Fragment>
                <br/><a href="/signin">Sign in</a>
              </Fragment>
            }
            </div>
          }
        </div>
      </div>
    </div>
   );
}

export default MyApp

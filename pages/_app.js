import '../styles/globals.css';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import React, { useEffect, useState, Fragment, useRef } from 'react';
import {clientCheckAuth} from '../utility/fetch';

const loadingWheel = (
  <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
);

const accountOnly = ['scholarshipprogress'];
const execOnly = ['execdashboard', 'companycontacts'];

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [blocked, setBlocked] = useState(null);
  const subscribed = useRef(false);

  // prevent updates when unmounted
  useEffect(() => { return () => {subscribed.current = false}}, []);

  // get user data
  useEffect(() => {
    subscribed.current = true;
    clientCheckAuth().then((result) => {
      if(!subscribed.current) return;

      const userCopy = result.is_exec === null ? null : {is_exec: result.is_exec, email: result.email};
      setUser(userCopy);

      const pageName = window.location.pathname.substring(1);
      setCurrentPage(pageName);
      checkBlocked(pageName, userCopy);

      subscribed.current = false;
    });
  }, [user, currentPage]);

  // check if user is unauthorized
  const checkBlocked = (pageName, user) => {
    let blocked = null;
    if(accountOnly.includes(pageName)) {
      blocked = !user
    } else if(execOnly.includes(pageName)) {
      blocked = !(user && user.is_exec);
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
            { !(user && user.is_exec !== null) &&
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

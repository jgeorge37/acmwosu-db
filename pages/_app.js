import Head from 'next/head';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css';
import NavBarV2 from '../components/NavBarV2';


function App({ Component, pageProps }) {
  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logorainbow.png" />
      </Head>
      <div className="app-container">
        <NavBarV2></NavBarV2>
        <div className="component-div">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
   );
}

export default App;

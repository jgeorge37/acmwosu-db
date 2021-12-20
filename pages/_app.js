import '../styles/app.css';
import Head from 'next/head';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function App({ Component, pageProps }) {
  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logorainbow.png" />
      </Head>
      <div className="app-container">
        <div className="component">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
   );
}

export default App;

import '../styles/globals.css';
import Head from 'next/head';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }) {
  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="app-container">
        <div className="navbar">
          <NavBar></NavBar>
        </div>
        <div className="component">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
   );
}

export default MyApp

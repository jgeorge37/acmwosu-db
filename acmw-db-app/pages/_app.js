import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return ( 
    <div>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </div>
   );
}

export default MyApp

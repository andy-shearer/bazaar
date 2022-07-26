import Head from "next/head";
import Link from 'next/link';
import classNames from "classnames";
import styles from '../styles/Nav.module.css';

export default function Nav(props) {
    const thisUrl = process.env.VERCEL_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL;

    return (
      <>
        <Head>
          <title>Trustless Bazaar</title>
          <meta name="description" content="Secure borrowing and lending" />

          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Graduate&display=swap" rel="stylesheet"/>
        </Head>

        <section className={styles.header} id="headerContent">
          <Link href="/">
            <img
              src="/logo_black.png"
              alt="Site logo of a sign displaying a tent"
              className={styles.logo}
              role="button"
            />
          </Link>

          <Link href='/explainer'>
            <a className={classNames(styles.headerLink, styles.link1)}>How It Works</a>
          </Link>

          <Link href='/bookshelf'>
            <a className={classNames(styles.headerLink, styles.link2)}>Bookshelf <span className={styles.newRainbow}>(NEW)</span></a>
          </Link>

          <Link href="/#borrowRequests">
            <a className={classNames(styles.headerLink, styles.link3)}>Borrow Requests</a>
          </Link>

          <Link href="/add-request">
            <a className={classNames(styles.headerLink, styles.link4)}>Create a Request</a>
          </Link>

          { props.wallet === "" ?
              <button
                className={styles.connectButton}
                onClick={props.onClickConnect}>
                  Connect Wallet
              </button>
            :
              <div className={styles.walletInfo}>
                Wallet: {props.wallet.slice(0, 6)}...{props.wallet.slice(-4)}
              </div>
          }
        </section>
      </>
    );
}
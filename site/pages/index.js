import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import BorrowRequests from "../components/BorrowRequests";
import AvailableBorrows from "../components/AvailableBorrows";
import Footer from "../components/Footer";
import classNames from "classnames";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Trustless Bazaar</title>
        <meta name="description" content="Secure borrowing and lending" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.header} id="headerContent">
        <img
          src="/logo_black.png"
          className={styles.logo}
        />

        <a href="" className={classNames(styles.headerLink, styles.link1)}>About</a>
        <a href="" className={classNames(styles.headerLink, styles.link2)}>How it Works</a>
        <a href="" className={classNames(styles.headerLink, styles.link3)}>App</a>
        <button className={styles.connectButton}>
            Connect Wallet
        </button>
      </section>

      <section className={styles.infoText}>
        <p className={styles.infoTextHeading}>
          Borrow the things<br/>
          you don't need to buy.
        </p>
        <p className={styles.infoTextSub}>
          A secure way for strangers to lend & borrow items.<br/>
          Secured by blockchain smart contracts.
        </p>
      </section>

      <img
        src="/homepage.jpg"
        title="Bazaar vector created by pikisuperstar - www.freepik.com"
        className={styles.homepageGraphic}
      />

      <main className={styles.main}>
        <h2 className={styles.title}>
          Borrow Requests
        </h2>

        <BorrowRequests />

        <h2 className={styles.title}>
          Available to Borrow
        </h2>

        <AvailableBorrows />
      </main>

      <Footer />
    </div>
  )
}

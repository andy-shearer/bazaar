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
          alt="Site logo of a sign displaying a tent"
          className={styles.logo}
        />

        <a href="" className={classNames(styles.headerLink, styles.link1)}>About</a>
        <a href="" className={classNames(styles.headerLink, styles.link2)}>How it Works</a>
        <a href="" className={classNames(styles.headerLink, styles.link3)}>App</a>
        <button className={styles.connectButton}>
            Connect Wallet
        </button>
      </section>

      <div id="wrapper" className={styles.wrapper}>
        <div id="parallaxContainer" className={styles.parallax_container}>
          <div id="backgroundImgContainer" className={styles.background}>
            <img src="/homepage.jpg" alt="Market vendors"/>
          </div>
          <div id="foregroundContainer" className={styles.foreground}>
            <div id="infoText" className={styles.infoText}>
              <p className={styles.infoTextHeading}>
                Borrow the things<br/>
                you don&apos;t need to buy.
              </p>
              <p className={styles.infoTextSub}>
                A secure way for strangers to lend & borrow items.<br/>
                Secured by blockchain smart contracts.
              </p>

              <h2>Collateralised Borrowing</h2>
              <p>
                The lender of the item can set the contingency value to the value of the item that they are lending.<br/><br/>
                This value is securely held in the platform by the borrower whilst the item is being borrowed.<br/>
                If the item isn&apos;t returned according to the terms of the agreement, the lender can claim the contingency value that the borrower provided.
              </p>

              <h2>Borrow More, Buy Less</h2>
              <p>
              A lot of people own things that they rarely use. Borrow these things from people in your local area.<br/><br/>
              Borrowing and lending is secured by blockchain smart contracts.<br/>
              Lend agreements are negotiated by both sides and the agreement is signed using the lender and borrower’s digital signatures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
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
      */}

      <Footer />
    </div>
  )
}

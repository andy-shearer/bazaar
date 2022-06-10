import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import BorrowRequests from "../components/BorrowRequests";
import AvailableBorrows from "../components/AvailableBorrows";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Trustless Bazaar</title>
        <meta name="description" content="Secure borrowing and lending" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

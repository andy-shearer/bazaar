import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import BorrowRequests from "../components/BorrowRequests";
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
        <h1 className={styles.title}>
          Borrow Requests
        </h1>

        <BorrowRequests />
      </main>

      <Footer />
    </div>
  )
}

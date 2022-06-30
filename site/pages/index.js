import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import BorrowRequests from "../components/BorrowRequests";
import AvailableBorrows from "../components/AvailableBorrows";
import Nav from "../components/Nav";
import PostCard from "../components/PostCard";
import Footer from "../components/Footer";
import classNames from "classnames";

import Web3Modal from "web3modal"
import { useState, useEffect, useRef } from "react";
import { Contract, providers, utils } from "ethers"

export default function Home({ posts }) {
  const [ walletConnected, setWalletConnected ] = useState("");
  const web3ModalRef = useRef();

  useEffect(() => {
    try {
      const provider = new providers.Web3Provider(window.ethereum);
      provider.listAccounts()
        .then(addresses => addresses.length > 0 && connectWallet());
    } catch(e) {
      console.log("We couldn't detect a wallet provider - You may not be able to connect to the app");
    }
  }, []);

  /**
   * Attempt to obtain the provider which will prompt wallet connection when used for the first time
   */
  const connectWallet = async () => {
    if(walletConnected === "") {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      });
    }

    try {
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      //console.debug("Wallet has been successfully connected", address);
      setWalletConnected(address);
    } catch (err) {
      /* Ignore the following errors:
       *   -32002:  Already processing eth_requestAccounts
       *   4001:    User rejected the request
       */
      if(![-32002, 4001].includes(err.code)) {
        console.log(err);
      }
    }
  }

  const getProviderOrSigner = async (signer) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);

    // If user is not connected to the Mumbai test network, let them know and throw an error
    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Ethereum Rinkeby (test network) and reload");
      throw new Error("Change the network to Ethereum Rinkeby (test network)");
    }

    return signer ? await provider.getSigner() : provider;
  }

  const borrowElements = posts.map((post, i) => (
      <PostCard post={post} key={i} />
  ));

  return (
    <div className={styles.landingContainer}>
      <Head>
        <title>Trustless Bazaar</title>
        <meta name="description" content="Secure borrowing and lending" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav wallet={walletConnected} onClickConnect={connectWallet} />

      <section className={styles.infoText}>
        <p className={styles.infoTextHeading}>
          Borrow the things<br/>
          you don&apos;t need to buy.
        </p>
        <p className={styles.infoTextSub}>
          A secure way for strangers to lend & borrow items.<br/>
          Secured by blockchain smart contracts.
        </p>
      </section>

      <div
        id="about"
        className={styles.detailContainer}
      >
        <div className={styles.detailText}>
          <h2 className={styles.detailHeader}>
            Borrow More, Buy Less
          </h2>
          <p>
            A lot of people own things that they rarely use. Borrow these things from people in your local area.<br/><br/>
            Borrowing and lending is secured by blockchain smart contracts. Lend agreements are negotiated by both sides and the agreement is signed using the lender and borrower&apos;s digital signatures.
          </p>
        </div>
        <img
          src="/market_1.png"
          alt="Market stall vendor selling various items"
          title="Bazaar vector created by pikisuperstar - www.freepik.com"
          className={classNames(styles.detailGraphic, styles.dg1, styles.graphicRight)}
        />

        <img
          src="/market_2.png"
          alt="Market stall vendor selling various items"
          title="Bazaar vector created by pikisuperstar - www.freepik.com"
          className={classNames(styles.detailGraphic, styles.dg2)}
        />

        <div className={classNames(styles.detailText, styles.textRight)}>
          <h2 className={styles.detailHeader}>
            Collateralised Borrowing
          </h2>
          <p>
            The lender of the item can set the contingency value to the value of the item that they are lending.
            This value is securely held in the platform by the borrower whilst the item is being borrowed.<br/><br/>
            If the item isn&apos;t returned according to the terms of the agreement, the lender can claim the contingency value that the borrower provided.
          </p>
        </div>
      </div>

      <div id="borrowRequests" className={styles.container}>
          {posts.length === 0 ? (
              <h2 className={styles.requestHeading}>No borrow requests :(</h2>
          ) : (
          <>
            <h2 className={styles.requestHeading}>Borrow requests :</h2>
            <div className={styles.borrowRequestContainer}>
              {borrowElements}
            </div>
          </>
          )}
      </div>

      {/*
      <div className={styles.infoContainer}>
        <h2 className={styles.infoHeader}>

        </h2>
        <p className={styles.infoText}>

        </p>
        <img
          src="/market_3.png"
          alt="Market stall vendor selling various items"
          title="Bazaar vector created by pikisuperstar - www.freepik.com"
          className={styles.homepageGraphic}
        />
      </div>

      <main className={styles.main}>
        <h2 className={styles.title}>
          Borrow Requests
        </h2>

        <BorrowRequests />

        <h2 className={styles.title}>
          Available to Borrow
        </h2>

        <AvailableBorrows />
      </main>*/}

      <Footer />
    </div>
  )
}

export async function getServerSideProps(ctx) {
    // get the current environment
    let dev = process.env.VERCEL_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // request posts from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/requests`);
    // extract the data
    let data = await response.json();

    return {
        props: {
            posts: data['message'],
        },
    };
}

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';
import styles from '../styles/Explainer.module.css';
import React, {useState, useEffect, useRef} from "react";
import Web3Modal from "web3modal";
import {providers} from "ethers"

export default function Explainer() {
    /*==================================================================
     * Wallet connection bits, currently just duplicated from index.js
     * TODO: move this into the Nav component
     *=================================================================*/

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

    /*==================================================================
     * Attempt to obtain the provider which will prompt wallet connection when used for the first time
     *=================================================================*/
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
        const msg = "Change the network to Ethereum Rinkeby (test network) and reload";
        window.alert(msg);
        throw new Error(msg);
      }

      return signer ? await provider.getSigner() : provider;
    }

    /*==================================================================
     * Actual component logic
     *=================================================================*/
    const [ timer, setTimer ] = useState(61);

    useEffect(() => {
      let myInterval = setInterval(() => {
        if (timer > 0) {
            setTimer(timer - 1);
        }
        if (timer === 0) {
            clearInterval(myInterval)
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    });

    const formatTimer = (unformatted) => {
      return (unformatted > 60) ? 60 : unformatted;
    };

    return (
      <>
        <Nav wallet={walletConnected} onClickConnect={connectWallet} />
        <div className={styles.infoTextHeading}>
            Here&apos;s how it works.<br />
            Explained in {formatTimer(timer)} seconds.
        </div>

        <div className={styles.infoTextHeading}>
            👇
        </div>

        <section className={styles.explanation}>
          {/* Lender */}
          <div className={styles.thirdsGrid}>
            <div className={styles.twoThirds}>
              If you&apos;ve got something that someone wants to borrow...<br/><br/>
              You&apos;re a <span className={styles.green}>lender</span>.
            </div>
            <img
              src="./give_dotted.png"
              className={styles.graphicRight}
            />
          </div>

          {/* Charges */}
          <div className={styles.thirdsGrid}>
            <div className={styles.wholeRow}>
              The <span className={styles.green}>lender</span> decides:
            </div>
            <img
              src="./item_value.png"
              className={styles.halfGraphic}
            />

            <img
              src="./borrow_fee.png"
              className={styles.halfGraphicRight}
            />
            <p className={styles.textBeneathImage}>how much the item is worth</p>
            <p className={styles.textBeneathImage}>how much the <span className={styles.orange}>borrower</span> has to pay them</p>
          </div>

          {/* Borrower initial steps */}
          <div className={styles.thirdsGrid}>
            <div className={styles.twoThirds}>
              If someone decides they want to borrow your item, they&apos;re a <span className={styles.orange}>borrower</span>.
            </div>
            <img
              src="./stall_img.png"
              className={styles.graphicRight}
            />
          </div>

          {/* Redirect */}
          <div className={styles.thirdsGrid}>
            <div className={styles.twoThirds}>
              Can someone borrow from you?<br/><br/>
              <Link
                href="/#borrowRequests"
                className={styles.redirectLink}
              > What do people want to borrow?</Link>
            </div>
            <img
              src="./community.png"
              className={styles.graphicRight}
            />
          </div>
        </section>
        <Footer />
      </>

    );
}
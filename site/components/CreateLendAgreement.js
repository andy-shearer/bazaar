import styles from "../styles/LendAgreement.module.css";
import Web3Modal from "web3modal";
import Link from 'next/link';
import { Contract, providers, utils } from "ethers";
import { useEffect, useState, useRef } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export default function CreateLendAgreement({ book, closePopup }) {
  const bookId = book._id;
  const slicedBorrowerAddress = `${book.address.slice(0, 6)}...${book.address.slice(-4)}`;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fee, setFee] = useState();
  const [loading, setLoading] = useState(false);
  const [collateral, setCollateral] = useState();
  const buttonText = message ? "Close" : "Cancel";

  /*==================================================================
   * Duplicated wallet connection bits, currently just duplicated from index.js
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

  const handleSubmit = async () => {
    let errorMsg;
    if(!fee || fee <= 0) {
      errorMsg = "You are not going to receive any fee for lending this item.";
    }

    if(!collateral || collateral <= 0) {
      errorMsg = `${errorMsg ? errorMsg : ""} You are advised to set an item value greater than 0 to protect against item damage or theft.`;
    }

    if(!errorMsg || (errorMsg === error)) { // If we have no errors, or the user has ignored our error
      // Clear an error if one is being displayed
      setError();
      const {res, e} = await createLendAgreement();
      setLoading(false);
      if(e) {
        errorMsg = e;
      }

      if(res){
        setMessage(res);
      }
    }
    setError(errorMsg);
  }

  const createLendAgreement = async () => {
    setLoading(true);

    if(!walletConnected) {
      const msg = "You must connect a crypto wallet in order to create a lend agreement. https://metamask.io/faqs/";
      console.log(msg);
      return {e: msg};
    }

    let created = true;
    try {
      const signer = await getProviderOrSigner(true);
      const lendsContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const borrowDuration = book.duration * 24;
      const borrowFee = fee ? utils.parseEther(fee) : 0;
      const borrowCollateral = collateral ? utils.parseEther(collateral) : 0;
      let tx = await lendsContract.createLendAgreement(walletConnected, book.address, borrowDuration, borrowFee, borrowCollateral);
      await tx.wait();
    } catch (err) {
        created = false;
        let msg;
        if(err.code === 4001) {
          msg = "User rejected the transaction";
          console.log(msg);
          return {e:msg};
        }
        /**
         * Allowed errors:
         *    -32002 "Already processing eth_requestAccounts. Please wait"
         */
        else if(err.code != -32002) {
          console.error(err);
          return {e:err};
        }
    }

    return {res: "Lend Agreement successfully created!"};
  }

  const closeCreateAgreement = () => {
    if(loading && !error) {
      setError("Warning: Your transaction may be in progress! Click 'Cancel' if you still want to close.");
    } else {
      closePopup();
    }
  }

  return (
    <section id="popup" className={styles.popup}>
      <button
        id="close"
        className={styles.closeButton}
        onClick={closePopup}
        title="Close"
      >
        X
      </button>
      <div className={styles.popupContent}>
        <span className={styles.title}>Create Lend Agreement</span>
        <span className={styles.subtitle}>
          You&apos;ve got something that somebody wants to borrow - you&apos;re a <span className={styles.orange}>lender</span>! Configure the lend agreement below to set your terms for lending this item.
        </span>

        <table className={styles.table}>
          <tbody>
            <tr className={styles.tableRow}>
              <td>Book Title:</td>
              <td>
                {book.title}

                </td>
            </tr>

            <tr className={styles.tableRow}>
              <td>Author:</td>
              <td>
                {book.author}
              </td>
            </tr>

            <tr className={styles.tableRow}>
              <td>Borrow Duration:</td>
              <td>
                {book.duration}
              </td>
            </tr>

            <tr><td><br/></td></tr>

            <tr className={styles.tableRow}>
              <td>Borrower Address:</td>
              <td>
                {slicedBorrowerAddress}
              </td>
            </tr>

            <tr className={styles.tableRow}>
              <td>Lender Address:</td>
              <td>
                {walletConnected ? `${walletConnected.slice(0, 6)}...${walletConnected.slice(-4)} (You)` : "Need to connect wallet"}
              </td>
            </tr>

            <tr><td><br/></td></tr>

            <tr className={styles.tableRow}>
              <td>Borrow Fee:</td>
              <td>
                <input
                  type="text"
                  name="fee"
                  onChange={(e) => setFee(e.target.value)}
                  value={fee}
                  placeholder="Fee you will receive"
                />
                <span> ETH</span>
              {
                fee &&
                <a target="_blank" href={`https://www.xe.com/currencyconverter/convert/?Amount=${fee}&From=ETH&To=GBP`} rel="noopener noreferrer">
                  <span title="How much is this in FIAT?" className={styles.convertButton}>🔁</span>
                </a>
              }
              </td>
            </tr>

            <tr className={styles.tableRow}>
              <td>Item value:</td>
              <td>
                <input
                  type="text"
                  name="collateral"
                  onChange={(e) => setCollateral(e.target.value)}
                  value={collateral}
                  placeholder="Amount borrower must stake"
                />
                <span> ETH</span>
              {
                collateral &&
                <a target="_blank" href={`https://www.xe.com/currencyconverter/convert/?Amount=${collateral}&From=ETH&To=GBP`} rel="noopener noreferrer">
                  <span title="How much is this in FIAT?" className={styles.convertButton}>🔁</span>
                </a>
              }
              </td>
            </tr>
          </tbody>
        </table>

        {error &&
          <div className={styles.formItem}>
              <h3 className={styles.error}>{error}</h3>
          </div>
        }
        {message &&
            <div className={styles.formItem}>
                <h3 className={styles.message}>{message}</h3>
            </div>
        }
        {loading &&
          <div className={styles.loading} title="Waiting for blockchain transaction...">
            <span>Loading...</span>
            <img
              src="/loading.gif"
              alt="Loading spinner"
              className={styles.loading}

            />
          </div>
        }

        <div id="buttonContainer" className={styles.buttonContainer}>
          { !message && !loading &&
              <button onClick={handleSubmit} className={styles.button}>Create</button>
          }
          <button className={styles.button} onClick={closeCreateAgreement}>{buttonText}</button>
        </div>
      </div>
    </section>
  );
}
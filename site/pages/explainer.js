import Nav from '../components/Nav';
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
    const [ timer, setTimer ] = useState(60);

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

//    setInterval(() => {
//      //setTimer(prevTimer => prevTimer >= 0 ? prevTimer-- : clearInterval(this));
//      setTimer((timer) => timer-1);
//      console.log(timer);
//    }, 1000);

    const formatTimer = (unformatted) => {
      if(unformatted < 10) {
        return `00:0${unformatted}`;
      } else {
        return `00:${unformatted}`;
      }
    };

    return (
      <>
        <Nav wallet={walletConnected} onClickConnect={connectWallet} />
        <div className={styles.infoTextHeading}>
            Here's how it works.<br />
            Explained in 60 seconds.
        </div>
        <div className={styles.countdown}>
          {formatTimer(timer)}
        </div>
        <div className={styles.infoTextHeading}>
            👇
        </div>
      </>

    );
}
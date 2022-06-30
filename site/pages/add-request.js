import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';
import {useState, useEffect, useRef} from "react";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers"

export default function AddRequest() {

    /*==================================================================
     * Wallet connection bits, currently just duplicated from index.js
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

    //
    // Actual state & logic for this page
    //

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handlePost = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!title || !duration) return setError('All fields are required');

        if (!walletConnected) return setError("Wallet is not connected!");

        // post structure
        let request = {
            title: title,
            duration: duration,
            address: walletConnected,
            createdAt: new Date().toISOString(),
        };
        // save the post
        let response = await fetch('/api/requests', {
            method: 'POST',
            body: JSON.stringify(request),
        });

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setTitle('');
            setDuration('');
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
    };



    return (
        <div>
            <Nav wallet={walletConnected} onClickConnect={connectWallet} />
            <div className={styles.container}>
                <form onSubmit={handlePost} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder="Title"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Duration</label>
                        <textarea
                            name="duration"
                            onChange={(e) => setDuration(e.target.value)}
                            value={duration}
                            placeholder="Borrow Duration"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Borrower Address</label>
                        <textarea
                            name="address"
                            value={walletConnected}
                            placeholder="Wallet not connected"
                            disabled={true}
                        />
                    </div>

                    <div className={styles.formItem}>
                        <button type="submit">Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
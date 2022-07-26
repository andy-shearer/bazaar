import Nav from '../components/Nav';
import Footer from '../components/Footer';
import styles from '../styles/BorrowRequest.module.css';
import {useState, useEffect, useRef} from "react";
import Web3Modal from "web3modal";
import { providers } from "ethers"

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
    const [author, setAuthor] = useState('');
    const [duration, setDuration] = useState('');
    const [type, setType] = useState('book');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handlePost = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!title || !duration || !type || (type==="book" && !author)) {
          return setError('All fields are required');
        }

        if (!walletConnected) return setError("Wallet is not connected!");

        // post structure
        let request = {
            title: title,
            duration: duration,
            type: type,
            address: walletConnected,
            createdAt: new Date().toISOString(),
        }

        if(type === "book") {
          request.author = author;
        }

        // save the post
        let response = await fetch('/api/requests', {
            method: 'POST',
            body: JSON.stringify(request),
        })

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setTitle('');
            setAuthor('');
            setDuration('');
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
    };



    return (
        <div className={styles.addRequestWrapper}>
            <Nav wallet={walletConnected} onClickConnect={connectWallet} />
            <div className={styles.requestContainer}>
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
                            placeholder="I'd like to borrow..."
                        />
                    </div>

                    {type === "book" &&
                      <div className={styles.formItem}>
                          <label>Author</label>
                          <input
                              type="text"
                              name="author"
                              onChange={(e) => setAuthor(e.target.value)}
                              value={author}
                              placeholder="Name of Author"
                          />
                      </div>
                    }

                    <div className={styles.formItem}>
                        <label>Duration</label>
                        <input
                            type="text"
                            name="duration"
                            onChange={(e) => setDuration(e.target.value)}
                            value={duration}
                            placeholder="And I'll give it back after..."
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="types">Type</label>
                        <select
                          name="types"
                          id="types"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="book">Book</option>
                          <option value="item">Item</option>
                          <option value="other">Other</option>
                        </select>
                    </div>
                    <div className={styles.formItem}>
                        <label>Borrower Address</label>
                        <input
                            type="text"
                            name="address"
                            value={walletConnected}
                            placeholder="Need to connect wallet!"
                            title="Not editable"
                            disabled={true}
                            className={styles.disabledFormItem}
                        />
                    </div>

                    <div className={styles.formItem}>
                        <button type="submit">Request</button>
                    </div>
                </form>
            </div>

          <Footer />
        </div>
    );
}
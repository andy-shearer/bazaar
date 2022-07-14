import Nav from '../components/Nav';
import styles from '../styles/BorrowRequest.module.css';
import {useState, useEffect, useRef} from "react";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers"

export default function Explainer() {
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
                        <label>Borrower Address</label>
                        <input
                            type="text"
                            name="address"
                            value={walletConnected}
                            placeholder="Need to connect wallet!"
                            title="Not editable"
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
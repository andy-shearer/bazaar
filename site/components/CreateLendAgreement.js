import { useState } from 'react';
import styles from "../styles/LendAgreement.module.css";

export default function CreateLendAgreement({ book, closePopup, wallet }) {
  const bookId = book._id;
  const slicedBorrowerAddress = `${book.address.slice(0, 6)}...${book.address.slice(-4)}`;
  const slicedWalletAddress = `${wallet.slice(0, 6)}...${wallet.slice(-4)} (You)`;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fee, setFee] = useState();
  const [collateral, setCollateral] = useState();

  const handleSubmit = () => {
    alert("TODO");
//    setMessage("");
//    setError("");
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
          <table className={styles.table}>
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
              <br />
              <tr className={styles.tableRow}>
                  <td>Borrower Address:</td>
                  <td>
                    {slicedBorrowerAddress}
                  </td>
              </tr>

              <tr className={styles.tableRow}>
                  <td>Lender Address:</td>
                  <td>
                    {slicedWalletAddress}
                  </td>
              </tr>
              <br />
              <tr className={styles.tableRow}>
                  <td>Borrow Fee:</td>
                  <td>
                    <input
                        type="text"
                        name="fee"
                        onChange={(e) => setFee(e.target.value)}
                        value={fee}
                        placeholder="Fee you receive"
                    />
                    <span> ETH</span>
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
                        placeholder="Amount borrower has to stake"
                    />
                    <span> ETH</span>
                  </td>
              </tr>


              {/*
              <div className={styles.formItem}>
                  <label>Borrow Duration</label>
                  <input
                      type="text"
                      name="duration"
                      value={book.duration}
                      title="Not editable"
                      disabled={true}
                      className={styles.disabledFormItem}
                  />
              </div>
              <div className={styles.formItem}>
                  <label>Borrower Address</label>
                  <input
                      type="text"
                      name="address"
                      value={slicedBorrowerAddress}
                      title="Not editable"
                      disabled={true}
                      className={styles.disabledFormItem}
                  />
              </div>*/}
          </table>

          <div id="buttonContainer" className={styles.buttonContainer}>
            <button onClick={handleSubmit} className={styles.button}>Create</button>
            <button className={styles.button} onClick={closePopup}>Cancel</button>
          </div>
        </div>
      </section>
  );
}
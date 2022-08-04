import { useState } from 'react';
import styles from "../styles/CreateAgreement.module.css";

export default function CreateAgreement({ book, closePopup }) {
  const bookId = book._id;
  return (
      <section id="popup" className={styles.popup}>
        <button
          id="close"
          className={styles.closeButton}
          onClick={closePopup}
        >
          X
        </button>
        <div className={styles.popupContent}>
          <span>{`User wants to create a lend agreement for ${bookId}`}</span>
        </div>
      </section>
  );
}
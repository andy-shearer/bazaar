import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/Home.module.css";

export default function BookInfo({ book, user, onClickLend, wallet }) {
    let slicedAddress = `${book.address.slice(0, 6)}...${book.address.slice(-4)}`;
    const myBook = book.address === user;
    if(myBook) {
      slicedAddress = `Me (${slicedAddress})`;
    }
    return (
        <div className={styles.requestContainer}>
            <h3 className={styles.requestTitle}>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Duration: {book.duration}</p>
            <p suppressHydrationWarning={true}>Added on: {new Date(book.createdAt).toLocaleDateString()}</p>
            <p>{book.request ? "Borrower" : "Lender"} Address: {slicedAddress}</p>

            {
              !myBook && wallet &&
              <button
                className={styles.lendButton}
                title="Click to lend this book"
                disabled={!wallet}
                onClick={() => onClickLend(book)}
              >
                Lend this book
              </button>
            }


            {
            /*<button type="button" >
                {'Delete'}
            </button>*/
            }
        </div>
    );
}
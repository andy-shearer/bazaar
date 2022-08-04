import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/Home.module.css";

export default function BookInfo({ book, user }) {
    let slicedAddress = `${book.address.slice(0, 6)}...${book.address.slice(-4)}`;
    const myBook = book.address === user;
    if(myBook) {
      slicedAddress = `Me (${slicedAddress})`;
    }
    return (
        <div className={styles.requestContainer}>
            <h3 className={styles.requestTitle}>{book.title}</h3>
            {
              !myBook &&
              <button className={styles.lendButton}>
                I have this book!
              </button>
            }
            <p>Author: {book.author}</p>
            <p>Duration: {book.duration}</p>
            <p suppressHydrationWarning={true}>Added on: {new Date(book.createdAt).toLocaleDateString()}</p>
            <p>Lender Address: {slicedAddress}</p>

            {
            /*<button type="button" >
                {'Delete'}
            </button>*/
            }
        </div>
    );
}
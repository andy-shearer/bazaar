import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/Home.module.css";

export default function PostCard({ post }) {
    return (
        <div className={styles.requestContainer}>
            <h3 className={styles.requestTitle}>{post.title}</h3>
            <p>Duration: {post.duration}</p>
            <p suppressHydrationWarning={true}>Requested on: {new Date(post.createdAt).toLocaleDateString()}</p>
            <p>Requester Address: {post.address.slice(0, 6)}...{post.address.slice(-4)}</p>

            {
            /*<button type="button" >
                {'Delete'}
            </button>*/
            }
        </div>
    );
}
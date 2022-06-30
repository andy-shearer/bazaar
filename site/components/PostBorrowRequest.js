import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PostBorrowRequest({ post }) {
    return (
        <>
            <li>
                <h3>{post.title}</h3>
                <ul>
                  <li>{post.duration}</li>
                </ul>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                <br />
                    <button type="button">
                        {'Publish'}
                    </button>
                <button type="button" >
                    {'Delete'}
                </button>
            </li>
        </>
    );
}
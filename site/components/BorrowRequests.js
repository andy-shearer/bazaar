import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { server } from '../config';

export default function BorrowRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function getBorrowRequests() {
      // Call to retrieve the borrow requests
      let response = await fetch(`${server}/api/borrows`, {
          method: 'GET'
      });

      // Get the data
      let res = await response.json();
      if(res.success) {
        setRequests(res.data);
      } else {
        console.error("Error fetching borrow requests", res.error);
      }
    }
    getBorrowRequests();
  }, []);

  const requestElements = requests.map(req => {
    return (
      <div key={req.id} className={styles.borrowRequest}>
        <h2>{req.item}</h2>
        <p>Request duration: {req.duration}</p>
        <p>Suggested borrow fee: {req.fee}</p>
      </div>
    )
  });

  return (
    <div id="requests">
      {requestElements}
    </div>
  );
}
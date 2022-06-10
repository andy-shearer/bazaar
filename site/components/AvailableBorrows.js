import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { server } from '../config';

export default function AvailableBorrows() {
  const [available, setRequests] = useState([]);

  useEffect(() => {
    async function getAvailableBorrows() {
      // Call to retrieve the available borrows
      let response = await fetch(`${server}/api/borrows`, {
          method: 'GET'
      });

      // Get the data
      let res = await response.json();
      if(res.success) {
        setRequests(res.data);
      } else {
        console.error("Error fetching available borrows", res.error);
      }
    }
    getAvailableBorrows();
  }, []);

  const borrowElements = available.map(req => {
    return (
      <div key={req.id} className={styles.borrowRequest}>
        <h3>{req.item}</h3>
        <p>Max duration: {req.duration}</p>
        <p>Fee: {req.fee}</p>
      </div>
    )
  });

  return (
    <div id="availableToBorrow">
      {borrowElements}
    </div>
  );
}
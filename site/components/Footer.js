import React from "react"
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/andy-shearer"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.a}
      >
        Built by Andy Shearer
      </a>
      <section className={styles.footerLinks}>
        <a href="https://twitter.com/devshez" target="_blank" rel="noopener noreferrer">
          <Image
            src="/twitter.svg"
            width="20px"
            height="20px"
            alt="Twitter logo"
          />
          &nbsp;devshez
        </a>
        <br />
        <a href="https://twitter.com/TrustlessBazaar" target="_blank" rel="noopener noreferrer">
          <Image
            src="/twitter.svg"
            width="20px"
            height="20px"
            alt="Twitter logo"
          />
          &nbsp;TrustlessBazaar
        </a>
      </section>
    </footer>
  );
}
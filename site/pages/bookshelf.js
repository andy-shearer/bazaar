import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookInfo from '../components/BookInfo';
import Link from 'next/link';
import styles from '../styles/Bookshelf.module.css';
import {useState, useRef, useEffect} from "react";
import Web3Modal from "web3modal";
import {providers} from "ethers"

export default function Bookshelf({ books }) {
    /*==================================================================
     * Duplicated wallet connection bits, currently just duplicated from index.js
     * TODO: move this into the Nav component
     *=================================================================*/

    const [ walletConnected, setWalletConnected ] = useState("");
    const web3ModalRef = useRef();

    useEffect(() => {
      try {
        const provider = new providers.Web3Provider(window.ethereum);
        provider.listAccounts()
          .then(addresses => addresses.length > 0 && connectWallet());
      } catch(e) {
        console.log("We couldn't detect a wallet provider - You may not be able to connect to the app");
      }
    }, []);

    /*==================================================================
     * Attempt to obtain the provider which will prompt wallet connection when used for the first time
     *=================================================================*/
    const connectWallet = async () => {
      if(walletConnected === "") {
        web3ModalRef.current = new Web3Modal({
          network: "rinkeby",
          providerOptions: {},
          disableInjectedProvider: false
        });
      }

      try {
        const signer = await getProviderOrSigner(true);
        const address = await signer.getAddress();
        //console.debug("Wallet has been successfully connected", address);
        setWalletConnected(address);
      } catch (err) {
        /* Ignore the following errors:
         *   -32002:  Already processing eth_requestAccounts
         *   4001:    User rejected the request
         */
        if(![-32002, 4001].includes(err.code)) {
          console.log(err);
        }
      }
    }

    const getProviderOrSigner = async (signer) => {
      const instance = await web3ModalRef.current.connect();
      const provider = new providers.Web3Provider(instance);

      // If user is not connected to the Mumbai test network, let them know and throw an error
      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        const msg = "Change the network to Ethereum Rinkeby (test network) and reload";
        window.alert(msg);
        throw new Error(msg);
      }

      return signer ? await provider.getSigner() : provider;
    }

    /*==================================================================
     * Actual component bits
     *=================================================================*/
    const borrowableBooks = books
      ?.filter(book => book.address !== walletConnected)
      .map((book, i) => (
        <BookInfo book={book} key={i} user={walletConnected} />
    ));

    //console.log("Borrowable books: ", borrowableBooks);

    const bookBorrowRequests = books
      ?.filter(book => (book.address === walletConnected && book.request))
      .map((book, i) => (
        <BookInfo book={book} key={i} user={walletConnected} />
    ));

    const myBooks = books
      ?.filter(book => book.address === walletConnected && !book.request)
      .map((book, i) => (
        <BookInfo book={book} key={i} user={walletConnected} />
    ));

    //console.log("Lendable books: ", myBooks);

    return (
      <>
        <Nav wallet={walletConnected} onClickConnect={connectWallet} />
        <section className={styles.alignmentContainer}>
          <h1 className={styles.infoTextHeading}>
              A decentralised library.
          </h1>
          <img
            src="/bookshelf_colour.png"
            className={styles.mainGraphic}
          />
          <h2 className={styles.infoTextSubHeading}>
              Borrow a book from a stranger. Securely.
          </h2>
        </section>

        <section className={styles.bookshelfContainer}>
          <section
            id="booksToBorrow"
          >
            <div className={styles.paddedContainer}>
                {borrowableBooks.length > 0 &&
                  <>
                    <h2 className={styles.infoTextSubHeading}>Books that people want to borrow</h2>
                    <div>
                      {borrowableBooks}
                    </div>
                  </>
                }
            </div>
          </section>

          { walletConnected &&
            <section
              id="myBorrowRequests"
            >
              <div className={styles.paddedContainer}>
                <h2 className={styles.infoTextSubHeading}>Books I want to borrow</h2>
                {bookBorrowRequests.length > 0 &&
                  <div>
                    {bookBorrowRequests}
                  </div>
                }

                <Link href="/add-request">
                  <button
                    title="Request a book"
                    className={styles.addButton}
                  >+</button>
                </Link>
              </div>
            </section>
          }

          {/* walletConnected &&
            <section
              id="booksToLend"
            >
              <div className={styles.paddedContainer}>
                <h2 className={styles.infoTextSubHeading}>Books I can lend</h2>
                {myBooks.length > 0 &&
                  <div>
                    {myBooks}
                  </div>
                }

                <Link href="/add-request">
                  <button
                    title="Lend a book"
                    className={styles.addButton}
                  >+</button>
                </Link>
              </div>

            </section>*/
          }
        </section>

        <Footer />
      </>

    );
}

export async function getServerSideProps(ctx) {
    // get the current environment
    let dev = process.env.VERCEL_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // request posts from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/getAllBooks`);
    // extract the data
    let data = await response.json();

    return {
        props: {
            books: data['message'],
        },
    };
}
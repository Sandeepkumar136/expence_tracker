import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import AddAccount from "./AddAccount";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "accounts";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingBarRef = useRef(null);

  const getAccounts = async () => {
    try {
      loadingBarRef.current.continuousStart(); // 🔥 start top bar
      setLoading(true);

      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );

      setAccounts(res.documents);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      loadingBarRef.current.complete(); // 🔥 end top bar
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="account-container">

      {/* 🔝 TOP LOADING BAR */}
      <LoadingBar color="#6366f1" ref={loadingBarRef} height={3} />

      <div className="account-card">
        <h2>Accounts</h2>

        {/* 🔄 LOADER */}
        {loading ? (
          <div className="loader-center">
            <ThreeDots
              height="60"
              width="60"
              color="#6366f1"
              visible={true}
            />
          </div>
        ) : accounts.length === 0 ? (
          <p className="center-text">No accounts found</p>
        ) : (
          <div className="account-grid">
            {accounts.map((acc) => (
              <div className="account-item" key={acc.$id}>
                <div className="account-icon">
                  <i
                    className={`bx ${
                      acc.name?.toLowerCase() === "cash"
                        ? "bx-wallet"
                        : "bx-bank"
                    }`}
                  ></i>
                </div>
                <div>
                  <h3>{acc.name}</h3>
                  <p>₹{acc.balance}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Account */}
      <AddAccount refreshAccounts={getAccounts} />
    </div>
  );
};

export default Accounts;
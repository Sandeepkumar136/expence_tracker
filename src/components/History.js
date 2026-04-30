import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "transactions";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadingBarRef = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        loadingBarRef.current.continuousStart();

        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.orderDesc("date")]
        );

        setTransactions(res.documents);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        loadingBarRef.current.complete();
      }
    };

    fetchTransactions();
  }, []);

  const filtered = transactions.filter((tx) =>
    (tx.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  const getMonthlyExpense = (items) =>
    items
      .filter((tx) => tx.type === "withdraw")
      .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="history-container">

      {/* 🔝 LOADING BAR */}
      <LoadingBar color="#6366f1" ref={loadingBarRef} height={3} />

      {/* HEADER */}
      <div className="history-header">
        <h2>Transaction History</h2>

        <div className="search-bar">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🔄 LOADER */}
      {loading ? (
        <div className="loader-center">
          <ThreeDots height="60" width="60" color="#6366f1" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        toast.info("Please add a transaction.")
      ) : (
        Object.keys(grouped).map((month) => (
          <div key={month} className="month-section">

            <div className="month-header">
              <span>{month}</span>
              <span className="month-total">
                ₹{getMonthlyExpense(grouped[month])}
              </span>
            </div>

            {grouped[month].map((tx) => (
              <div
                key={tx.$id}
                className="history-item"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="history-icon">
                  {tx.type === "deposit" ? "⬆️" : "⬇️"}
                </div>

                <div className="history-info">
                  <p>{tx.category || "Transaction"}</p>
                  <span>{new Date(tx.date).toLocaleString()}</span>
                </div>

                <div className={`history-amount ${tx.type}`}>
                  {tx.type === "deposit" ? "+ " : "- "}₹{tx.amount}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* 🔥 MODAL */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h3>Transaction Details</h3>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <span>Type</span>
                <b>{selectedTx.type}</b>
              </div>

              <div className="modal-row">
                <span>Amount</span>
                <b>₹{selectedTx.amount}</b>
              </div>

              <div className="modal-row">
                <span>Category</span>
                <b>{selectedTx.category}</b>
              </div>

              <div className="modal-row">
                <span>Date</span>
                <b>{new Date(selectedTx.date).toLocaleString()}</b>
              </div>

              <div className="modal-note">
                {selectedTx.note || "No note"}
              </div>
            </div>

            <button className="modal-btn" onClick={() => setSelectedTx(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
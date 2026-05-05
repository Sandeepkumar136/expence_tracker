import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "transactions";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [actionTx, setActionTx] = useState(null);
  const [editTx, setEditTx] = useState(null);
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

  // 🔍 FILTER
  const filtered = transactions.filter((tx) =>
    (tx.category || "").toLowerCase().includes(search.toLowerCase())
  );

  // 📅 GROUP
  const grouped = filtered.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  // 💰 MONTH TOTAL
  const getMonthlyExpense = (items) =>
    items
      .filter((tx) => tx.type === "withdraw")
      .reduce((sum, tx) => sum + tx.amount, 0);

  // 🗑 DELETE
  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      setTransactions((prev) => prev.filter((t) => t.$id !== id));
      setActionTx(null);
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ UPDATE
  const handleUpdate = async () => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        editTx.$id,
        {
          amount: Number(editTx.amount),
          note: editTx.note,
        }
      );

      setTransactions((prev) =>
        prev.map((t) => (t.$id === editTx.$id ? editTx : t))
      );

      setEditTx(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="history-container">

      <LoadingBar color="#6366f1" ref={loadingBarRef} height={3} />

      {/* HEADER */}
      <div className="history-header">
        <h2>Transaction History</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="loader-center">
          <ThreeDots height="60" width="60" color="#6366f1" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="empty">No transactions found</p>
      ) : (
        Object.keys(grouped).map((month) => (
          <div key={month} className="month-section">

            <div className="month-header">
              <span>{month}</span>
              <span>₹{getMonthlyExpense(grouped[month])}</span>
            </div>

            {grouped[month].map((tx) => (
              <div key={tx.$id} className="history-item">

                {/* CLICK → DETAILS */}
                <div
                  className="history-main"
                  onClick={() => setSelectedTx(tx)}
                >
                  <div className="history-icon">
                    {tx.type === "deposit" ? "⬆️" : "⬇️"}
                  </div>

                  <div className="history-info">
                    <p className="tx-category">
                      {tx.category || "General"}
                    </p>
                    <span>
                      {new Date(tx.date).toLocaleString()}
                    </span>
                  </div>

                  <div className={`history-amount ${tx.type}`}>
                    {tx.type === "deposit" ? "+" : "-"}₹{tx.amount}
                  </div>
                </div>

                {/* 3 DOT MENU */}
                <div
                  className="tx-menu"
                  onClick={() => setActionTx(tx)}
                >
                  ⋮
                </div>

              </div>
            ))}
          </div>
        ))
      )}

      {/* ACTION MENU */}
      {actionTx && (
        <div className="action-overlay" onClick={() => setActionTx(null)}>
          <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => {
              setEditTx(actionTx);
              setActionTx(null);
            }}>
              ✏️ Edit
            </button>

            <button onClick={() => handleDelete(actionTx.$id)}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editTx && (
        <div className="modal-overlay" onClick={() => setEditTx(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Transaction</h3>

            <input
              type="number"
              value={editTx.amount}
              onChange={(e) =>
                setEditTx({ ...editTx, amount: e.target.value })
              }
            />

            <input
              type="text"
              value={editTx.note}
              onChange={(e) =>
                setEditTx({ ...editTx, note: e.target.value })
              }
            />

            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Transaction Details</h3>

            <p><b>Type:</b> {selectedTx.type}</p>
            <p><b>Amount:</b> ₹{selectedTx.amount}</p>
            <p><b>Category:</b> {selectedTx.category || "General"}</p>
            <p><b>Date:</b> {new Date(selectedTx.date).toLocaleString()}</p>
            <p>{selectedTx.note || "No note"}</p>

            <button onClick={() => setSelectedTx(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;
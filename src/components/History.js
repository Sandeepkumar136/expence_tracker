import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "motion/react";

const DATABASE_ID = "69e8d8b30039451280c9";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [actionTx, setActionTx] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadingBarRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loadingBarRef.current.continuousStart();

        const tx = await databases.listDocuments(
          DATABASE_ID,
          "transactions",
          [Query.orderDesc("date")]
        );

        const acc = await databases.listDocuments(
          DATABASE_ID,
          "accounts"
        );

        setTransactions(tx.documents);
        setAccounts(acc.documents);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        loadingBarRef.current.complete();
      }
    };

    fetchData();
  }, []);

  const getAccountName = (id) =>
    accounts.find((a) => a.$id === id)?.name || "Unknown";

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

  // 📱 HOLD
  const handlePressStart = (tx) => {
    timerRef.current = setTimeout(() => {
      setActionTx(tx);
    }, 500);
  };

  const handlePressEnd = () => {
    clearTimeout(timerRef.current);
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, "transactions", id);
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
        "transactions",
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
            placeholder="Search..."
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
      ) : (
        Object.keys(grouped).map((month) => (
          <div key={month} className="month-section">

            <div className="month-header">
              <span>{month}</span>
              <span>₹{getMonthlyExpense(grouped[month])}</span>
            </div>

            {grouped[month].map((tx) => (
              <motion.div
                key={tx.$id}
                className="history-item"

                onClick={() => setSelectedTx(tx)}

                onMouseDown={() => handlePressStart(tx)}
                onMouseUp={handlePressEnd}
                onTouchStart={() => handlePressStart(tx)}
                onTouchEnd={handlePressEnd}

                whileTap={{ scale: 0.97 }}
              >
                <div>{tx.type === "deposit" ? "⬆️" : "⬇️"}</div>

                <div>
                  <p>{tx.category}</p>
                  <span>
                    {getAccountName(tx.accountId)} •{" "}
                    {new Date(tx.date).toLocaleString()}
                  </span>
                </div>

                <div>
                  {tx.type === "deposit" ? "+" : "-"}₹{tx.amount}
                </div>

                {/* DESKTOP MENU */}
                <div
                  className="tx-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActionTx(tx);
                  }}
                >
                  ⋮
                </div>
              </motion.div>
            ))}
          </div>
        ))
      )}

      {/* ACTION MENU */}
      <AnimatePresence>
        {actionTx && (
          <motion.div
            className="action-overlay"
            onClick={() => setActionTx(null)}
          >
            <motion.div
              className="action-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => {
                setEditTx(actionTx);
                setActionTx(null);
              }}>
                ✏️ Edit
              </button>

              <button onClick={() => handleDelete(actionTx.$id)}>
                🗑 Delete
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTx && (
          <motion.div className="modal-overlay" onClick={() => setEditTx(null)}>
            <motion.div className="modal" onClick={(e) => e.stopPropagation()}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default History;
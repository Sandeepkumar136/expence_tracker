import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

const DATABASE_ID = "69e8d8b30039451280c9";
const TRANSACTION_COLLECTION = "transactions";
const ACCOUNT_COLLECTION = "accounts";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [actionTx, setActionTx] = useState(null);
  const [editTx, setEditTx] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadingBarRef = useRef(null);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      loadingBarRef.current.continuousStart();

      // TRANSACTIONS
      const txRes = await databases.listDocuments(
        DATABASE_ID,
        TRANSACTION_COLLECTION,
        [Query.orderDesc("date")],
      );

      // ACCOUNTS
      const accRes = await databases.listDocuments(
        DATABASE_ID,
        ACCOUNT_COLLECTION,
      );

      setTransactions(txRes.documents);
      setAccounts(accRes.documents);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🏦 GET ACCOUNT NAME
  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.$id === accountId);

    return account ? account.name : "Unknown";
  };

  // 🔍 SEARCH
  const filtered = transactions.filter((tx) => {
    const keyword = search.toLowerCase();

    return (
      (tx.category || "").toLowerCase().includes(keyword) ||
      (tx.note || "").toLowerCase().includes(keyword) ||
      getAccountName(tx.accountId).toLowerCase().includes(keyword)
    );
  });

  // 📅 GROUP BY MONTH
  const grouped = filtered.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(tx);

    return acc;
  }, {});

  // 💰 MONTHLY EXPENSE
  const getMonthlyExpense = (items) => {
    return items
      .filter((tx) => tx.type === "withdraw")
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  // 🗑 DELETE TRANSACTION
  const handleDelete = async (tx) => {
    try {
      const account = accounts.find((a) => a.$id === tx.accountId);

      if (!account) return;

      let newBalance = account.balance;

      // 🔄 RESTORE BALANCE
      if (tx.type === "withdraw") {
        newBalance += tx.amount;
      } else {
        newBalance -= tx.amount;
      }

      // UPDATE ACCOUNT
      await databases.updateDocument(
        DATABASE_ID,
        ACCOUNT_COLLECTION,
        tx.accountId,
        {
          balance: newBalance,
        },
      );

      // DELETE TRANSACTION
      await databases.deleteDocument(
        DATABASE_ID,
        TRANSACTION_COLLECTION,
        tx.$id,
      );

      // UPDATE UI
      setTransactions((prev) => prev.filter((t) => t.$id !== tx.$id));

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.$id === tx.accountId
            ? {
                ...acc,
                balance: newBalance,
              }
            : acc,
        ),
      );

      setActionTx(null);
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ UPDATE TRANSACTION
  const handleUpdate = async () => {
    try {
      const oldTx = transactions.find((t) => t.$id === editTx.$id);

      const account = accounts.find((a) => a.$id === editTx.accountId);

      if (!account || !oldTx) return;

      let balance = account.balance;

      // REMOVE OLD EFFECT
      if (oldTx.type === "withdraw") {
        balance += oldTx.amount;
      } else {
        balance -= oldTx.amount;
      }

      // APPLY NEW EFFECT
      if (editTx.type === "withdraw") {
        balance -= Number(editTx.amount);
      } else {
        balance += Number(editTx.amount);
      }

      // UPDATE TRANSACTION
      await databases.updateDocument(
        DATABASE_ID,
        TRANSACTION_COLLECTION,
        editTx.$id,
        {
          amount: Number(editTx.amount),
          note: editTx.note,
        },
      );

      // UPDATE ACCOUNT
      await databases.updateDocument(
        DATABASE_ID,
        ACCOUNT_COLLECTION,
        editTx.accountId,
        {
          balance,
        },
      );

      // UPDATE UI
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.$id === editTx.$id
            ? {
                ...editTx,
                amount: Number(editTx.amount),
              }
            : tx,
        ),
      );

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.$id === editTx.accountId
            ? {
                ...acc,
                balance,
              }
            : acc,
        ),
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
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LOADER */}
      {loading ? (
        <div className="loader-center">
          <ThreeDots height="60" width="60" color="#6366f1" />
        </div>
      ) : (
        Object.keys(grouped).map((month) => (
          <div key={month} className="month-section">
            {/* MONTH HEADER */}
            <div className="month-header">
              <span>{month}</span>

              <span className="month-total">
                ₹{getMonthlyExpense(grouped[month])}
              </span>
            </div>

            {/* TRANSACTIONS */}
            {grouped[month].map((tx) => (
              <div key={tx.$id} className="history-item">
                {/* MAIN */}
                <div className="history-main" onClick={() => setSelectedTx(tx)}>
                  {/* ICON */}
                  <div className="history-content">
                    <div className="history-icon">
                      {tx.type === "deposit" ? "⬆️" : "⬇️"}
                    </div>

                    {/* INFO */}
                    <div className="history-info">
                      <p className="tx-category">
                        {tx.category || "Transaction"}
                      </p>

                      <div className="history-spans">
                        {/* ACCOUNT */}
                        <span className="tx-account">
                          {getAccountName(tx.accountId)}
                        </span>

                      {/* DATE */}
                      <span className="tx-date">
                        {new Date(tx.date).toLocaleString()}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className={`history-amount ${tx.type}`}>
                    {tx.type === "deposit" ? "+" : "-"} ₹{tx.amount}
                  </div>
                </div>

                {/* MENU */}
                <div className="tx-menu" onClick={() => setActionTx(tx)}>
                  <i className="bx bx-dots-vertical-rounded" />
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
            <button
              onClick={() => {
                setEditTx(actionTx);
                setActionTx(null);
              }}
            >
              ✏️ Edit
            </button>

            <button onClick={() => handleDelete(actionTx)}>🗑 Delete</button>
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
                setEditTx({
                  ...editTx,
                  amount: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={editTx.note || ""}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  note: e.target.value,
                })
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

            <p>
              <b>Type:</b> {selectedTx.type}
            </p>

            <p>
              <b>Amount:</b> ₹{selectedTx.amount}
            </p>

            <p>
              <b>Category:</b> {selectedTx.category}
            </p>

            <p>
              <b>Account:</b> {getAccountName(selectedTx.accountId)}
            </p>

            <p>
              <b>Date:</b> {new Date(selectedTx.date).toLocaleString()}
            </p>

            <p>
              <b>Note:</b> {selectedTx.note || "No note"}
            </p>

            <button onClick={() => setSelectedTx(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

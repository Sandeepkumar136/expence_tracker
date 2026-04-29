import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

const DATABASE_ID = "69e8d8b30039451280c9";
const ACCOUNTS_COLLECTION = "accounts";
const TRANSACTIONS_COLLECTION = "transactions";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const loadingBarRef = useRef(null);

  // dropdown states
  const [openType, setOpenType] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);

  const typeRef = useRef();
  const accRef = useRef();

  // close dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (!typeRef.current?.contains(e.target)) setOpenType(false);
      if (!accRef.current?.contains(e.target)) setOpenAccount(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        loadingBarRef.current.continuousStart(); // 🔥 start bar

        const res = await databases.listDocuments(
          DATABASE_ID,
          ACCOUNTS_COLLECTION
        );

        setAccounts(res.documents);
      } catch (err) {
        console.log(err);
      } finally {
        loadingBarRef.current.complete(); // 🔥 stop bar
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountId || !amount) {
      alert("Please select account and enter amount");
      return;
    }

    setLoading(true);
    loadingBarRef.current.continuousStart(); // 🔥 start bar

    try {
      const account = await databases.getDocument(
        DATABASE_ID,
        ACCOUNTS_COLLECTION,
        accountId
      );

      const amt = Number(amount);

      if (type === "withdraw" && account.balance < amt) {
        alert("Insufficient balance ❌");
        return;
      }

      await databases.createDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        ID.unique(),
        {
          type,
          amount: amt,
          accountId,
          category,
          date: new Date().toISOString(),
          note,
        }
      );

      const newBalance =
        type === "deposit"
          ? account.balance + amt
          : account.balance - amt;

      await databases.updateDocument(
        DATABASE_ID,
        ACCOUNTS_COLLECTION,
        accountId,
        { balance: newBalance }
      );

      alert("Transaction Added ✅");

      setAmount("");
      setCategory("");
      setNote("");
      setAccountId("");

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      loadingBarRef.current.complete(); // 🔥 end bar
    }
  };

  return (
    <div className="transaction-container">

      {/* 🔝 TOP LOADING BAR */}
      <LoadingBar color="#6366f1" ref={loadingBarRef} height={3} />

      <form className="transaction-card" onSubmit={handleSubmit}>
        <h2>Add Transaction</h2>

        {/* TYPE */}
        <div className="custom-select" ref={typeRef}>
          <div className="selected" onClick={() => setOpenType(!openType)}>
            {type === "deposit" ? "Deposit" : "Withdraw"}
          </div>

          {openType && (
            <div className="options">
              <div onClick={() => { setType("deposit"); setOpenType(false); }}>
                Deposit
              </div>
              <div onClick={() => { setType("withdraw"); setOpenType(false); }}>
                Withdraw
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT */}
        <div className="custom-select" ref={accRef}>
          <div onClick={() => setOpenAccount(!openAccount)} className="selected">
            {accountId
              ? accounts.find((a) => a.$id === accountId)?.name
              : "Select Account"}
          </div>

          {openAccount && (
            <div className="options">
              {accounts.map((acc) => (
                <div
                  key={acc.$id}
                  onClick={() => {
                    setAccountId(acc.$id);
                    setOpenAccount(false);
                  }}
                >
                  {acc.name} ₹{acc.balance}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUTS */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* BUTTON */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <ThreeDots   height="20" width="40" color="#fff" />
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>
    </div>
  );
};

export default Transactions;
import React, { useEffect, useState, useRef } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

const DATABASE_ID = "69e8d8b30039451280c9";
const ACCOUNTS_COLLECTION = "accounts";
const TRANSACTIONS_COLLECTION = "transactions";
const CATEGORY_COLLECTION = "categories";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [type, setType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const loadingBarRef = useRef(null);

  const [openType, setOpenType] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const typeRef = useRef();
  const accRef = useRef();
  const catRef = useRef();

  // 🔒 Close dropdowns
  useEffect(() => {
    const handleClick = (e) => {
      if (!typeRef.current?.contains(e.target)) setOpenType(false);
      if (!accRef.current?.contains(e.target)) setOpenAccount(false);
      if (!catRef.current?.contains(e.target)) setOpenCategory(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔥 Reset category when type changes (IMPORTANT FIX)
  useEffect(() => {
    setCategory("");
  }, [type]);

  // 📥 Fetch accounts + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        loadingBarRef.current.continuousStart();

        const acc = await databases.listDocuments(
          DATABASE_ID,
          ACCOUNTS_COLLECTION
        );

        const cat = await databases.listDocuments(
          DATABASE_ID,
          CATEGORY_COLLECTION
        );

        setAccounts(acc.documents);
        setCategories(cat.documents);

      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        loadingBarRef.current.complete();
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amt = Number(amount);

    // ✅ VALIDATION
    if (!accountId || !category || !amount) {
      toast.error("Fill all fields");
      return;
    }

    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    setLoading(true);
    loadingBarRef.current.continuousStart();

    try {
      const account = await databases.getDocument(
        DATABASE_ID,
        ACCOUNTS_COLLECTION,
        accountId
      );

      // ❌ Prevent invalid withdraw
      if (type === "withdraw" && account.balance < amt) {
        toast.error("Insufficient balance ❌");
        setLoading(false);
        loadingBarRef.current.complete();
        return;
      }

      // 📝 Create transaction
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

      // 💰 Update account balance
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

      toast.success("Transaction added");

      // 🔄 Reset form
      setAmount("");
      setCategory("");
      setNote("");
      setAccountId("");

    } catch (err) {
      console.log("Transaction error:", err);
      toast.error("Transaction failed ❌");
    } finally {
      setLoading(false);
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="transaction-container">

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

        {/* CATEGORY */}
        <div className="custom-select" ref={catRef}>
          <div className="selected" onClick={() => setOpenCategory(!openCategory)}>
            {category || "Select Category"}
          </div>

          {openCategory && (
            <div className="options">
              {categories
                .filter((c) => c.type === type)
                .map((c) => (
                  <div
                    key={c.$id}
                    onClick={() => {
                      setCategory(c.name);
                      setOpenCategory(false);
                    }}
                  >
                    {c.name}
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
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* BUTTON */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <ThreeDots height="20" width="40" color="#fff" />
          ) : (
            "Add Transaction"
          )}
        </button>
      </form>
    </div>
  );
};

export default Transactions;
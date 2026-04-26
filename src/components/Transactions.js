import React, { useEffect, useState } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";

const DATABASE_ID = "69e8d8b30039451280c9";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  // 🔥 Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await databases.listDocuments(
        DATABASE_ID,
        "accounts"
      );
      setAccounts(res.documents);
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await databases.createDocument(
        DATABASE_ID,
        "transactions",
        ID.unique(),
        {
          type,
          amount: Number(amount),
          accountId,
          category,
          date: new Date(),
          note,
        }
      );

      alert("Transaction Added ✅");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* TYPE */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="deposit">Deposit</option>
        <option value="withdraw">Withdraw</option>
      </select>

      {/* ACCOUNT DROPDOWN */}
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      >
        <option value="">Select Account</option>

        {accounts.map((acc) => (
          <option key={acc.$id} value={acc.$id}>
            {acc.name} (₹{acc.balance})
          </option>
        ))}
      </select>

      {/* AMOUNT */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* CATEGORY */}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* NOTE */}
      <input
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
};

export default Transactions;
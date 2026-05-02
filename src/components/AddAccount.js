import React, { useState } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "accounts";

const AddAccount = ({ refreshAccounts }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !balance) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name,
          balance: Number(balance),
        }
      );

      setName("");
      setBalance("");

      refreshAccounts(); // 🔥 auto refresh

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-card inp">
      <h2>Add Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Account Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default AddAccount;
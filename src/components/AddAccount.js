import React, { useState } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "accounts";

const AddAccount = () => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name,
          balance: Number(balance)
        }
      );

      alert("Account Created ✅");

      setName("");
      setBalance("");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Add Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Account Name (Cash / Bank)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AddAccount;
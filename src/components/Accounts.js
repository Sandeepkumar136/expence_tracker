import React, { useEffect, useState } from "react";
import { databases } from "../appwrite/config";
import AddAccount from "./AddAccount";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "accounts";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAccounts = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      setAccounts(res.documents);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div>
      <h2>My Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        accounts.map((acc) => (
          <div key={acc.$id}>
            <h3>{acc.name}</h3>
            <p>₹{acc.balance}</p>
          </div>
        ))
      )}
      <AddAccount/>
    </div>
  );
};

export default Accounts;
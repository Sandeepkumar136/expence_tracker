import React, { useEffect, useState } from "react";
import { databases } from "../appwrite/config";
import { Query } from "appwrite";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DATABASE_ID = "69e8d8b30039451280c9";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tx = await databases.listDocuments(
        DATABASE_ID,
        "transactions",
        [Query.limit(200)]
      );

      const acc = await databases.listDocuments(
        DATABASE_ID,
        "accounts"
      );

      setTransactions(tx.documents);
      setAccounts(acc.documents);
    };

    fetchData();
  }, []);

  // 💰 TOTAL BALANCE
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  // 🔥 ONLY EXPENSES
  const expenses = transactions.filter((tx) => tx.type === "withdraw");

  // 📅 MONTHLY EXPENSE
  const monthlyData = Object.values(
    expenses.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
      });

      acc[month] = acc[month] || { name: month, total: 0 };
      acc[month].total += tx.amount;

      return acc;
    }, {})
  );

  // 🏷️ CATEGORY
  const categoryData = Object.values(
    expenses.reduce((acc, tx) => {
      const cat = tx.category || "Other";

      acc[cat] = acc[cat] || { name: cat, value: 0 };
      acc[cat].value += tx.amount;

      return acc;
    }, {})
  );

  // 🏦 ACCOUNT
  const accountData = Object.values(
    expenses.reduce((acc, tx) => {
      const accountName =
        accounts.find((a) => a.$id === tx.accountId)?.name || "Unknown";

      acc[accountName] = acc[accountName] || {
        name: accountName,
        total: 0,
      };

      acc[accountName].total += tx.amount;

      return acc;
    }, {})
  );

  return (
    <div className="analytics-container">

      {/* 🔥 PORTFOLIO CARD */}
      <div className="portfolio-card">
        <h2>Total Balance</h2>
        <h1>₹{totalBalance}</h1>
        <p>Across all accounts</p>
      </div>

      {/* 📅 MONTHLY */}
      <div className="chart-card">
        <h3>Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🏷️ CATEGORY */}
      <div className="chart-card">
        <h3>By Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              innerRadius={50}
              outerRadius={90}
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🏦 ACCOUNT */}
      <div className="chart-card">
        <h3>By Account</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={accountData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Analytics;
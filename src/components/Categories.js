import React, { useEffect, useState } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";
import { motion } from "motion/react";

const DATABASE_ID = "69e8d8b30039451280c9";
const COLLECTION_ID = "categories";

const Categories = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("withdraw");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      setCategories(res.documents);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("Enter category name");
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
          type,
        }
      );

      setName("");
      fetchCategories();

    } catch (err) {
      console.log("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete category
  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      fetchCategories();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
      <>
      <motion.form
        className="category-card"
        onSubmit={handleSubmit}
        initial={{ y: 30 }}
        animate={{ y: 0 }}
      >
        <h2>Add Category</h2>

        <input
          type="text"
          placeholder="Category name (Food, Travel...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="withdraw">Expense</option>
          <option value="deposit">Income</option>
        </select>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
        >
          {loading ? "Adding..." : "Add Category"}
        </motion.button>
      </motion.form>

      {/* 📋 LIST */}
      <div className="category-list">
        {categories.length === 0 ? (
          <p className="center-text">No categories found</p>
        ) : (
          categories.map((cat) => (
            <motion.div
              key={cat.$id}
              className="category-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h3>{cat.name}</h3>
                <span className={cat.type === "deposit" ? "income" : "expense"}>
                  {cat.type}
                </span>
              </div>

              <button onClick={() => handleDelete(cat.$id)}>
                Delete
              </button>
            </motion.div>
          ))
        )}
      </div>
      </>
  );
};

export default Categories;
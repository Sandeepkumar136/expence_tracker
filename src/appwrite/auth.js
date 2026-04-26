import { account } from "./config";
import { ID } from "appwrite";

// Signup
export const signup = async (email, password, name) => {
  return await account.create(ID.unique(), email, password, name);
};

// Login
export const login = async (email, password) => {
  return await account.createEmailPasswordSession(email, password);
};

// Logout
export const logout = async () => {
  return await account.deleteSession("current");
};

// Get current user
export const getUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};
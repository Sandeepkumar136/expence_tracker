// src/lib/appwrite.js
import { Client, Account, Databases, ID, Permission, Role } from 'appwrite';

// 🔗 Appwrite Config
export const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '69e8d69b002dd50775f0';

// 🗄️ Database
export const DB_ID = '69e8d8b30039451280c9';

// 📂 Collections
export const COLLECTIONS = {
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
};

// (Optional - only if needed)
export const ADMIN_USER_ID = '69e8d887000d08bfe377';

// ⚙️ Client Setup
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// 🔐 Services
export const account = new Account(client);
export const databases = new Databases(client);

// 📦 Exports
export { ID, Permission, Role };
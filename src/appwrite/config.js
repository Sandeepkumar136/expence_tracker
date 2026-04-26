import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("69e8d69b002dd50775f0");

export const account = new Account(client);
export const databases = new Databases(client);
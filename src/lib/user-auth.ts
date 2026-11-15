import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";

export interface StoredUser {
  id?: string;
  name: string;
  email: string;
  password: string; // encoded
  createdAt: string;
}

const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "users.json");

function getLocalUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_PATH)) {
      fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify([]), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local users.json:", err);
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local users.json:", err);
  }
}

export async function findUser(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Try MongoDB Atlas first
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") }
    });
    if (user) {
      return {
        id: user._id?.toString(),
        name: user.name || "Student",
        email: user.email,
        password: user.password,
        createdAt: user.createdAt?.toString() || new Date().toISOString()
      };
    }
  } catch (mongoErr: any) {
    console.warn("[Auth Notice] MongoDB Atlas unreachable, querying local store:", mongoErr?.message);
  }

  // Fallback to local store
  const localUsers = getLocalUsers();
  const matched = localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
  return matched || null;
}

export async function registerUser(name: string, email: string, encodedPassword: string): Promise<StoredUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || "Student",
    email: normalizedEmail,
    password: encodedPassword,
    createdAt: new Date().toISOString()
  };

  let savedToAtlas = false;

  // Attempt save to MongoDB Atlas
  try {
    const { db } = await connectToDatabase();
    await db.collection("users").insertOne({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      createdAt: new Date()
    });
    savedToAtlas = true;
    console.log("[Auth] Successfully saved user to MongoDB Atlas:", newUser.email);
  } catch (mongoErr: any) {
    console.warn("[Auth Notice] Could not save to MongoDB Atlas (Check Atlas IP Whitelist):", mongoErr?.message);
  }

  // Always save to local store as well for immediate reliability
  const localUsers = getLocalUsers();
  const filtered = localUsers.filter(u => u.email.toLowerCase() !== normalizedEmail);
  filtered.push(newUser);
  saveLocalUsers(filtered);

  return newUser;
}

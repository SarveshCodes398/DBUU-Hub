import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";

export interface StoredUser {
  id?: string;
  name: string;
  email: string;
  erpId: string;
  password: string; // encoded
  createdAt: string;
}

const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "users.json");

function getLocalUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_PATH)) {
      const dir = path.dirname(LOCAL_DATA_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

export async function findUser(identifier: string): Promise<StoredUser | null> {
  const normalized = identifier.trim().toLowerCase();

  // Try MongoDB Atlas first
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({
      $or: [
        { email: { $regex: new RegExp(`^${normalized}$`, "i") } },
        { erpId: { $regex: new RegExp(`^${normalized}$`, "i") } }
      ]
    });
    if (user) {
      return {
        id: user._id?.toString(),
        name: user.name || "Student",
        email: user.email,
        erpId: user.erpId || "DBUU-STUDENT",
        password: user.password,
        createdAt: user.createdAt?.toString() || new Date().toISOString()
      };
    }
  } catch (mongoErr: any) {
    console.warn("[Auth Notice] MongoDB Atlas unreachable, querying local store:", mongoErr?.message);
  }

  // Fallback to local store
  const localUsers = getLocalUsers();
  const matched = localUsers.find(
    u => u.email.toLowerCase() === normalized || (u.erpId && u.erpId.toLowerCase() === normalized)
  );
  return matched || null;
}

export async function registerUser(
  name: string,
  email: string,
  erpId: string,
  encodedPassword: string
): Promise<StoredUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedErp = erpId.trim().toUpperCase();

  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || "DBUU Student",
    email: normalizedEmail,
    erpId: normalizedErp,
    password: encodedPassword,
    createdAt: new Date().toISOString()
  };

  // Attempt save to MongoDB Atlas
  try {
    const { db } = await connectToDatabase();
    await db.collection("users").insertOne({
      name: newUser.name,
      email: newUser.email,
      erpId: newUser.erpId,
      password: newUser.password,
      createdAt: new Date()
    });
    console.log("[Auth] Successfully saved user to MongoDB Atlas:", newUser.email, newUser.erpId);
  } catch (mongoErr: any) {
    console.warn("[Auth Notice] Could not save to MongoDB Atlas (Check Atlas IP Whitelist):", mongoErr?.message);
  }

  // Always save to local store as well for immediate reliability
  const localUsers = getLocalUsers();
  const filtered = localUsers.filter(
    u => u.email.toLowerCase() !== normalizedEmail && u.erpId?.toUpperCase() !== normalizedErp
  );
  filtered.push(newUser);
  saveLocalUsers(filtered);

  return newUser;
}

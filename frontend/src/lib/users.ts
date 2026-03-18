// In-memory user store (replace with a real DB in production)
import { hashPassword } from "./auth";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor" | "viewer";
  onboardingCompleted: boolean;
  createdAt: string;
}

const users: User[] = [];

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const existing = users.find(u => u.email === email);
  if (existing) throw new Error("EMAIL_EXISTS");

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: "admin",
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  return users[idx];
}

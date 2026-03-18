import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/users";
import { comparePassword, signToken } from "@/lib/auth";

const attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    const key = email.toLowerCase().trim();
    const now = Date.now();
    const record = attempts.get(key);

    if (record && record.count >= MAX_ATTEMPTS && now - record.lastAttempt < LOCKOUT_MS) {
      return NextResponse.json({ error: "Compte temporairement verrouillé. Réessayez dans 10 minutes." }, { status: 429 });
    }

    const user = findUserByEmail(key);
    if (!user) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      const prev = attempts.get(key) || { count: 0, lastAttempt: 0 };
      attempts.set(key, { count: prev.count + 1, lastAttempt: now });
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    attempts.delete(key);
    const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, onboardingCompleted: user.onboardingCompleted },
    });

    response.cookies.set("sp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

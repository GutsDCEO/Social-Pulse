import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const user = await createUser(name.trim(), email.toLowerCase().trim(), password);
    const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });

    response.cookies.set("sp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

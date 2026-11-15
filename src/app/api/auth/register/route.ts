import { NextResponse } from "next/server";
import { findUser, registerUser } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters long" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await findUser(email);
    if (existingUser) {
      return NextResponse.json({ error: "Account already exists with this email. Please Login." }, { status: 400 });
    }

    const encodedPassword = Buffer.from(password).toString("base64");
    const user = await registerUser(name, email, encodedPassword);

    // Set auth cookie
    const token = Buffer.from(JSON.stringify({ 
      email: user.email, 
      name: user.name, 
      ts: Date.now() 
    })).toString("base64");

    const response = NextResponse.json({ 
      success: true, 
      message: "Registration successful" 
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 });
  }
}

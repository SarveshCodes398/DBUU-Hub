import { NextResponse } from "next/server";
import { findUser } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await findUser(email);
    if (!user) {
      return NextResponse.json({ 
        error: "No account found with this email. Please register first." 
      }, { status: 401 });
    }

    // Verify password
    const encodedPassword = Buffer.from(password).toString("base64");
    if (user.password !== encodedPassword) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    // Set auth cookie
    const token = Buffer.from(JSON.stringify({ 
      email: user.email, 
      name: user.name, 
      ts: Date.now() 
    })).toString("base64");

    const response = NextResponse.json({ 
      success: true, 
      message: "Login successful" 
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}

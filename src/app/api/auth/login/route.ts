import { NextResponse } from "next/server";
import { findUser } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = body.email || body.erpId || body.identifier;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email or Student ERP ID and password are required" }, { status: 400 });
    }

    const user = await findUser(identifier);
    if (!user) {
      return NextResponse.json({ 
        error: "No student account found with this Email / ERP ID. Please register first." 
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
      erpId: user.erpId || "DBUU-STUDENT",
      ts: Date.now() 
    })).toString("base64");

    const response = NextResponse.json({ 
      success: true, 
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        erpId: user.erpId || "DBUU-STUDENT"
      }
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

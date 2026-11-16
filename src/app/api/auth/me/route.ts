import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUser } from "@/lib/user-auth";

export async function GET() {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("auth_token");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ loggedIn: false, user: null }, { status: 200 });
    }

    try {
      const decoded = JSON.parse(Buffer.from(tokenCookie.value, "base64").toString("utf-8"));
      if (decoded?.email) {
        const user = await findUser(decoded.email);
        if (user) {
          return NextResponse.json({
            loggedIn: true,
            user: {
              name: user.name,
              email: user.email,
              erpId: user.erpId || decoded.erpId || "DBUU-STUDENT",
              createdAt: user.createdAt
            }
          });
        }
      }

      // If user from token exists
      if (decoded?.name && decoded?.email) {
        return NextResponse.json({
          loggedIn: true,
          user: {
            name: decoded.name,
            email: decoded.email,
            erpId: decoded.erpId || "DBUU-STUDENT"
          }
        });
      }
    } catch (e) {
      // invalid token
    }

    return NextResponse.json({ loggedIn: false, user: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get current user" }, { status: 500 });
  }
}

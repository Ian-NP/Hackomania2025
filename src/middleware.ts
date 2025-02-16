import { NextRequest, NextResponse } from "next/server";
import { auth } from "lib/firebaseAdmin";

export async function middleware(req: NextRequest) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await auth.verifyIdToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  const isLoggedIn = req.cookies.get('auth')
  const isAuthPage = req.nextUrl.pathname.startsWith('/(auth)')
  const isHomePage = req.nextUrl.pathname.startsWith('/(user)')

  if (!isLoggedIn && isHomePage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return NextResponse.next()
}

export const config = {
    matcher: "/api/data/:path*",
    
};

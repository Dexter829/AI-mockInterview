// This example assumes you're placing the middleware in the same directory as your page.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check the path of the incoming request
  if (request.nextUrl.pathname.startsWith('/app/page')) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
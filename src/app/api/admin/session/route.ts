import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = verifyAdminSessionToken(token);

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

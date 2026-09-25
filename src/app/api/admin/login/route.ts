import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Fallback in-memory rate limiting for login attempts
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lock after 5 failed attempts

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';
    const now = Date.now();

    // Check rate limit via Supabase (distributed) or in-memory fallback
    let failedCount = 0;

    if (isSupabaseConfigured && supabase) {
      const fifteenMinsAgo = new Date(now - LOCK_DURATION_MS).toISOString();
      const { count, error } = await supabase
        .from('admin_login_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('attempted_at', fifteenMinsAgo);

      if (!error && typeof count === 'number') {
        failedCount = count;
      }
    } else {
      const attemptRecord = failedAttemptsMap.get(ip);
      if (attemptRecord) {
        if (now < attemptRecord.lockedUntil) {
          failedCount = attemptRecord.count;
        } else if (now >= attemptRecord.lockedUntil) {
          failedAttemptsMap.delete(ip);
        }
      }
    }

    if (failedCount >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many failed attempts. Account locked for 15 minutes.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password.trim());

    if (!isValid) {
      // Record failed attempt in Supabase
      if (isSupabaseConfigured && supabase) {
        await supabase.from('admin_login_attempts').insert({ ip });
      }

      // Also update in-memory
      const current = failedAttemptsMap.get(ip) || { count: 0, lockedUntil: 0 };
      const newCount = (failedCount || current.count) + 1;
      const lockedUntil = newCount >= MAX_ATTEMPTS ? now + LOCK_DURATION_MS : 0;
      failedAttemptsMap.set(ip, { count: newCount, lockedUntil });

      const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - newCount);
      return NextResponse.json(
        {
          success: false,
          error: attemptsRemaining > 0
            ? `Invalid password. ${attemptsRemaining} attempt(s) remaining.`
            : 'Too many failed attempts. Account locked for 15 minutes.',
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    if (isSupabaseConfigured && supabase) {
      await supabase.from('admin_login_attempts').delete().eq('ip', ip);
    }
    failedAttemptsMap.delete(ip);

    // Create session token and set cookie
    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authentication successful' });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  findUserById,
  toPublicUser,
  SESSION_COOKIE,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = verifySessionToken(token);

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}

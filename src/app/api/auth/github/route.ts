import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${req.nextUrl.origin}/api/auth/github/callback`;

  if (!clientId) {
    // If no OAuth client ID is configured in .env, redirect back with a helpful message
    return NextResponse.redirect(
      new URL('/?auth=github_no_client_id', req.nextUrl.origin)
    );
  }

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', 'read:user user:email');

  return NextResponse.redirect(githubAuthUrl.toString());
}

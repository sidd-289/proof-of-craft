import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?auth_error=missing_credentials', req.nextUrl.origin));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/?auth_error=token_exchange_failed', req.nextUrl.origin));
    }

    // Fetch user details with access token
    const userRes = await fetch('https://api.github.com/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Tracker-Agent-App',
      },
    });

    const userData = await userRes.json();

    // Redirect back to main page with verified GitHub session
    const successUrl = new URL('/', req.nextUrl.origin);
    successUrl.searchParams.set('auth_success', 'github');
    successUrl.searchParams.set('username', userData.login || '');
    successUrl.searchParams.set('token', accessToken);

    return NextResponse.redirect(successUrl.toString());
  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?auth_error=server_error', req.nextUrl.origin));
  }
}

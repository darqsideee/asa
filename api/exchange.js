// Vercel Serverless Function: Exchange Discord OAuth2 authorization code for access token
// Deploy instructions:
// - Put this file in /api/exchange.js of a repo deployed on Vercel
// - Set the following Environment Variables in Vercel Project Settings:
//   DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
// - Optionally set ALLOW_ORIGIN to your site origin (e.g. https://darqsideee.github.io)
// - After deploy, set cfg.tokenExchangeUrl in app.js to https://<your-project>.vercel.app/api/exchange

export default async function handler(req, res) {
  // CORS
  const allowOrigin = process.env.ALLOW_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, redirect_uri } = req.body || {};
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'Missing code or redirect_uri' });
    }

    const params = new URLSearchParams();
    params.set('client_id', process.env.DISCORD_CLIENT_ID);
    params.set('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', redirect_uri);

    const r = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'exchange_failed', details: data });
    }

    return res.status(200).json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      scope: data.scope,
    });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', message: e.message });
  }
}

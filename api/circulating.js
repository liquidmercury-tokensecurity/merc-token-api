// API endpoint to return Liquid Mercury (MERC) circulating supply (static value)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Static circulating supply value
  // Update this number as needed
  const CIRCULATING_SUPPLY = 750000000;

  // Return formatted response
  return res.status(200).json({
    circulating_supply: CIRCULATING_SUPPLY,
    source: 'Static',
    timestamp: new Date().toISOString(),
  });
}
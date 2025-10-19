// API endpoint to fetch Liquid Mercury (MERC) circulating supply from CoinGecko
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

  try {
    // Fetch MERC data from CoinGecko Pro API
    const url = 'https://pro-api.coingecko.com/api/v3/coins/liquid-mercury';
    const options = {
      method: 'GET',
      headers: {
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY || ,
        'Accept': 'application/json'
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract circulating supply from market data
    const circulatingSupply = data.market_data?.circulating_supply;

    if (!circulatingSupply) {
      throw new Error('Circulating supply not available in response');
    }

    // Return formatted response
    return res.status(200).json({
      circulating_supply: circulatingSupply,
      source: 'CoinGecko',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching MERC circulating supply:', error);
    
    return res.status(500).json({
      error: 'Failed to fetch circulating supply',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// API endpoint to fetch Liquid Mercury (MERC) total supply from Etherscan
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
    // MERC token contract address
    const CONTRACT_ADDRESS = '0x6EE2f71049DDE9a93B7c0EE1091b72aCf9b46810';
    
    // Etherscan API key
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'F4MQFMZ1FWDWM24HU4F5A8Y2WNSSE6QTYN';
    
    // Fetch total supply from Etherscan
    const url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if we got valid data
    if (data.status !== '1' || !data.result) {
      throw new Error(data.message || 'Invalid response from Etherscan');
    }

    // Convert from wei to tokens (assuming 18 decimals)
    const DECIMALS = 18;
    const totalSupply = Number(data.result) / Math.pow(10, DECIMALS);

    // Return formatted response
    return res.status(200).json({
      total_supply: totalSupply,
      source: 'Etherscan',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching MERC total supply:', error);
    
    return res.status(500).json({
      error: 'Failed to fetch total supply',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
import { getBidPacks } from '../server/controllers/bidPackController';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bidPacks = await getBidPacks();
      return res.status(200).json(bidPacks);
    } catch (error) {
      console.error('Error fetching bid packs:', error);
      return res.status(500).json({ error: 'Failed to fetch bid packs' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
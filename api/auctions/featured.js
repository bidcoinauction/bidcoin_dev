import { getFeaturedAuctions } from '../../server/controllers/auctionController';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const auctions = await getFeaturedAuctions();
      return res.status(200).json(auctions);
    } catch (error) {
      console.error('Error fetching featured auctions:', error);
      return res.status(500).json({ error: 'Failed to fetch featured auctions' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
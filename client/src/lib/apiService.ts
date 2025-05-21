/**
 * Central API service file
 * Consolidates all API interactions in one place
 */

import axios from 'axios';
import { Auction, NFT, BidPack, Activity, BlockchainStats } from "@shared/schema";
import { mockAuctions, mockFeaturedAuctions, mockBidPacks, mockActivity, mockBlockchainStats } from './mockData';

const api = axios.create({
  baseURL: '/api'
});

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Auction API functions
 */
export const auctionService = {
  /**
   * Get all auctions
   */
  getAuctions: () => {
    if (isProduction) {
      return Promise.resolve(mockAuctions);
    }
    return api.get<Auction[]>("/auctions").then(res => res.data);
  },

  /**
   * Get auction by ID
   */
  getAuction: async (id: number): Promise<Auction> => {
    if (isProduction) {
      return Promise.resolve(mockAuctions.find(a => a.id === id) || mockAuctions[0]);
    }
    
    const { data } = await api.get<Auction>(`/auctions/${id}`);
    return data;
  },

  /**
   * Get featured auctions
   */
  getFeaturedAuctions: () => {
    if (isProduction) {
      return Promise.resolve(mockFeaturedAuctions);
    }
    return api.get<Auction[]>("/auctions/featured").then(res => res.data);
  },

  /**
   * Place a bid on an auction
   */
  placeBid: (auctionId: number, amount: string, bidderAddress: string) => {
    if (isProduction) {
      // Simulate a successful bid in production
      return Promise.resolve({
        ...mockAuctions.find(a => a.id === auctionId) || mockAuctions[0],
        currentBid: parseFloat(amount),
        bidCount: (mockAuctions.find(a => a.id === auctionId)?.bidCount || 0) + 1
      });
    }
    return api.post<Auction>(`/bids`, {
      auctionId,
      amount,
      bidderAddress,
    }).then(res => res.data);
  }
};

/**
 * BidPack API functions
 */
export const bidPackService = {
  /**
   * Get all bid packs
   */
  getBidPacks: () => {
    if (isProduction) {
      return Promise.resolve(mockBidPacks);
    }
    return api.get<BidPack[]>("/bidpacks").then(res => res.data);
  },

  /**
   * Get bid pack by ID
   */
  getBidPack: (id: number) => {
    if (isProduction) {
      return Promise.resolve(mockBidPacks.find(bp => bp.id === id) || mockBidPacks[0]);
    }
    return api.get<BidPack>(`/bidpacks/${id}`).then(res => res.data);
  },

  /**
   * Purchase a bid pack
   */
  purchaseBidPack: (bidPackId: number, walletAddress: string) => {
    if (isProduction) {
      // Simulate a successful purchase in production
      return Promise.resolve({
        success: true,
        bidPack: mockBidPacks.find(bp => bp.id === bidPackId) || mockBidPacks[0]
      });
    }
    return api.post("/bidpacks/purchase", {
      bidPackId,
      walletAddress,
    }).then(res => res.data);
  },

  /**
   * Get user's bid packs
   */
  getUserBidPacks: (userId: number) => {
    if (isProduction) {
      // Return some mock user bid packs
      return Promise.resolve([
        { id: 1, userId, bidPackId: 1, remainingBids: 15 },
        { id: 2, userId, bidPackId: 2, remainingBids: 50 }
      ]);
    }
    return api.get<any[]>(`/users/${userId}/bidpacks`).then(res => res.data);
  }
};

/**
 * Activity API functions
 */
export const activityService = {
  /**
   * Get all activity
   */
  getActivity: () => {
    if (isProduction) {
      return Promise.resolve(mockActivity);
    }
    return api.get<Activity[]>("/activity").then(res => res.data);
  }
};

/**
 * Blockchain API functions
 */
export const blockchainService = {
  /**
   * Get blockchain stats
   */
  getBlockchainStats: () => {
    if (isProduction) {
      return Promise.resolve(mockBlockchainStats);
    }
    return api.get<BlockchainStats>("/blockchain/stats").then(res => res.data);
  }
};

/**
 * User API functions
 */
export const userService = {
  /**
   * Get user by wallet address
   */
  getUserByWalletAddress: (walletAddress: string) => {
    if (isProduction || !walletAddress) {
      // Return a mock user in production
      return Promise.resolve(walletAddress ? {
        id: 1,
        walletAddress,
        username: `user_${walletAddress.substring(0, 6)}`,
        avatarUrl: "https://i.pravatar.cc/150?u=" + walletAddress
      } : null);
    }
    return api.get<any>(`/users/by-wallet/${walletAddress}`).then(res => res.data);
  }
};

/**
 * Achievement API functions
 */
export const achievementService = {
  /**
   * Get user achievements
   */
  getUserAchievements: (userId: number) => {
    if (isProduction) {
      // Return mock achievements in production
      return Promise.resolve([
        { id: 1, name: "First Bid", description: "Place your first bid", completed: true },
        { id: 2, name: "Bid Master", description: "Place 10 bids", completed: false }
      ]);
    }
    return api.get<any[]>(`/users/${userId}/achievements`).then(res => res.data);
  },

  /**
   * Get user achievement stats
   */
  getUserAchievementStats: (userId: number) => {
    if (isProduction) {
      // Return mock achievement stats in production
      return Promise.resolve({
        totalAchievements: 10,
        completedAchievements: 3,
        progress: 30
      });
    }
    return api.get<any>(`/users/${userId}/achievement-stats`).then(res => res.data);
  }
};

// Export all services as a single object for convenience
export const nftApi = {
  getDetailedMetadata: (contractAddress: string, tokenId: string, chainId: number = 1) => {
    if (isProduction) {
      // Return mock metadata in production
      return Promise.resolve({
        name: `NFT #${tokenId}`,
        description: "A beautiful NFT from a popular collection",
        image_url: "https://i.seadn.io/gae/PWDq8erM96AfJb_MkDZzxQnVbj3sIYQRLrR9xZZ1-4F-3xZR1GFTQd-U5T0nS3LcYyQHotZnNzIAYjcV9ngZEyUPpPP-1XJZ4Hl9?auto=format&dpr=1&w=1000",
        collection_name: "Sample Collection",
        contract_address: contractAddress,
        token_id: tokenId,
        traits: [
          { trait_type: "Background", value: "Blue", rarity: 0.15 },
          { trait_type: "Eyes", value: "Laser", rarity: 0.05 },
          { trait_type: "Mouth", value: "Grin", rarity: 0.2 }
        ]
      });
    }
    return api.get(`/nft/metadata?contractAddress=${contractAddress}&tokenId=${tokenId}&chainId=${chainId}`)
      .then(res => res.data);
  }
};

export const alchemyApi = {
  getNFTMetadata: (contractAddress: string, tokenId: string) => {
    if (isProduction) {
      // Return mock Alchemy data in production
      return Promise.resolve({
        title: `NFT #${tokenId}`,
        description: "A beautiful NFT from the Alchemy API",
        image: { url: "https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=1000" },
        collection: { name: "Alchemy Collection" },
        attributes: [
          { trait_type: "Background", value: "Red", rarity: 0.25 },
          { trait_type: "Fur", value: "Gold", rarity: 0.1 },
          { trait_type: "Hat", value: "Crown", rarity: 0.05 }
        ]
      });
    }
    return api.get(`/alchemy/nft?contractAddress=${contractAddress}&tokenId=${tokenId}`)
      .then(res => res.data);
  }
};

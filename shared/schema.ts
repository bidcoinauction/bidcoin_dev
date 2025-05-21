// Basic schema definitions shared between client and server

export interface User {
  id: number;
  username: string;
  walletAddress: string;
  password: string;
  email: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date | null;
}

export interface NFT {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress: string;
  tokenId: string;
  blockchain: string;
  tokenStandard: string;
  royalty: string;
  collection: string;
  collectionName: string;
  floorPrice?: string;
  currency: string;
  category: string;
  creatorId: number;
  attributes: Array<{
    trait_type: string;
    value: string;
    rarity: string;
  }>;
}

export interface Bid {
  id: number;
  auctionId: number;
  bidder: User;
  amount: string;
  timestamp: Date;
}

export interface Auction {
  id: number;
  name: string;
  description: string;
  nft: NFT;
  startingPrice: string;
  currentBid: string;
  bidCount: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'ended' | 'cancelled';
  creator: User;
  winner: User | null;
  bids: Bid[];
}

export interface BidPack {
  id: number;
  name: string;
  description: string | null;
  type: string;
  bidCount: number;
  bonusBids: number;
  totalBids: number;
  price: string;
  originalPrice: string;
  pricePerBid: string;
  currency: string;
  acceptedPaymentMethods: string[];
  imageUrl: string | null;
  color: string | null;
  featured: boolean | null;
  sortOrder: number;
  available: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Activity {
  id: number;
  type: 'bid' | 'purchase' | 'listing' | 'sale';
  user: User;
  auction?: Auction;
  nft?: NFT;
  amount?: string;
  timestamp: Date;
}

export interface BlockchainStats {
  transactions: number;
  gasPrice: string;
  blockHeight: number;
  lastBlockTime: Date;
}

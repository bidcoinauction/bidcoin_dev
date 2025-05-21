import { Auction, NFT, BidPack, Activity, BlockchainStats, User } from "@shared/schema";

// Mock NFTs
const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "CryptoPunk #3100",
    description: "One of the 9 Alien CryptoPunks, and one of the most iconic NFTs in existence.",
    imageUrl: "https://i.seadn.io/gae/PWDq8erM96AfJb_MkDZzxQnVbj3sIYQRLrR9xZZ1-4F-3xZR1GFTQd-U5T0nS3LcYyQHotZnNzIAYjcV9ngZEyUPpPP-1XJZ4Hl9?auto=format&dpr=1&w=1000",
    contractAddress: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    tokenId: "3100",
    blockchain: "ETH",
    tokenStandard: "ERC-721",
    royalty: "5",
    collection: "CryptoPunks",
    collectionName: "CryptoPunks",
    floorPrice: "68.5",
    currency: "ETH",
    category: "collectible",
    creatorId: 1,
    attributes: [
      { trait_type: "Type", value: "Alien", rarity: "0.09" },
      { trait_type: "Accessory", value: "Headband", rarity: "4.5" }
    ]
  },
  {
    id: 2,
    name: "Bored Ape #8817",
    description: "Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs — unique digital collectibles living on the Ethereum blockchain.",
    imageUrl: "https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=1000",
    contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenId: "8817",
    blockchain: "ETH",
    tokenStandard: "ERC-721",
    royalty: "2.5",
    collection: "Bored Ape Yacht Club",
    collectionName: "Bored Ape Yacht Club",
    floorPrice: "87.2",
    currency: "ETH",
    category: "art",
    creatorId: 2,
    attributes: [
      { trait_type: "Background", value: "Blue", rarity: "12.5" },
      { trait_type: "Fur", value: "Golden Brown", rarity: "5.2" },
      { trait_type: "Eyes", value: "Bored", rarity: "8.7" },
      { trait_type: "Mouth", value: "Bored", rarity: "23.4" }
    ]
  }
];

// Mock Users
const mockUsers: User[] = [
  {
    id: 1,
    username: "CryptoCollector",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    password: "hashed_password_1",
    email: "crypto@example.com",
    avatar: "https://i.pravatar.cc/150?u=cryptopunk",
    bio: "Collecting rare NFTs since 2017",
    createdAt: new Date()
  },
  {
    id: 2,
    username: "NFTWhale",
    walletAddress: "0x8474627fD4893cDa3c81A36a8a7FE73984F2ec12",
    password: "hashed_password_2",
    email: "whale@example.com",
    avatar: "https://i.pravatar.cc/150?u=nftwhale",
    bio: "Big NFT collector and investor",
    createdAt: new Date()
  }
];

// Mock Auctions
export const mockAuctions: Auction[] = [
  {
    id: 1,
    name: "CryptoPunk #3100",
    description: "Bid on this iconic CryptoPunk alien, one of only 9 in existence!",
    nft: mockNFTs[0],
    startingPrice: "0.01",
    currentBid: "4.2",
    bidCount: 12,
    startTime: new Date(Date.now() - 86400000), // 1 day ago
    endTime: new Date(Date.now() + 3600000), // 1 hour from now
    status: "active",
    creator: mockUsers[0],
    winner: null,
    bids: [
      {
        id: 1,
        auctionId: 1,
        bidder: mockUsers[1],
        amount: "4.2",
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
      }
    ]
  }
];

// Mock Featured Auctions
export const mockFeaturedAuctions = mockAuctions;

// Mock Bid Packs
export const mockBidPacks: BidPack[] = [
  {
    id: 1,
    name: "Starter Pack",
    description: "Get started with 10 bids",
    type: "starter",
    bidCount: 10,
    bonusBids: 0,
    totalBids: 10,
    price: "0.05",
    originalPrice: "0.05",
    pricePerBid: "0.005",
    currency: "ETH",
    acceptedPaymentMethods: ['ETH', 'BTC', 'USDC'],
    imageUrl: "https://placehold.co/200x200/3498db/ffffff?text=10+Bids",
    color: "#3498db",
    featured: false,
    sortOrder: 1,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Premium Pack",
    description: "50 bids at a discounted price",
    type: "premium",
    bidCount: 50,
    bonusBids: 5,
    totalBids: 55,
    price: "0.2",
    originalPrice: "0.25",
    pricePerBid: "0.0036",
    currency: "ETH",
    acceptedPaymentMethods: ['ETH', 'BTC', 'USDC'],
    imageUrl: "https://placehold.co/200x200/2ecc71/ffffff?text=50+Bids",
    color: "#2ecc71",
    featured: true,
    sortOrder: 2,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock Activity
export const mockActivity: Activity[] = [
  {
    id: 1,
    type: "bid",
    user: mockUsers[1],
    auction: mockAuctions[0],
    nft: mockNFTs[0],
    amount: "4.2",
    timestamp: new Date(Date.now() - 300000) // 5 minutes ago
  }
];

// Mock Blockchain Stats
export const mockBlockchainStats: BlockchainStats = {
  transactions: 1542367,
  gasPrice: "25",
  blockHeight: 18245632,
  lastBlockTime: new Date(Date.now() - 12000) // 12 seconds ago
};

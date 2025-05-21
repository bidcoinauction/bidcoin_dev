// Create the alchemyApi service
export const alchemyApi = {
  getNFTMetadata: async (contractAddress: string, tokenId: string) => {
    try {
      const response = await fetch(`/api/alchemy/nft/${contractAddress}/${tokenId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching NFT metadata from Alchemy:', error);
      throw error;
    }
  },
  
  getOwnedNFTs: async (ownerAddress: string) => {
    try {
      const response = await fetch(`/api/alchemy/owned/${ownerAddress}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching owned NFTs from Alchemy:', error);
      throw error;
    }
  },
  
  getCollectionMetadata: async (contractAddress: string) => {
    try {
      const response = await fetch(`/api/alchemy/collection/${contractAddress}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching collection metadata from Alchemy:', error);
      throw error;
    }
  }
};
import express from 'express';
import { log } from '../vite';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint
router.get('/test', (req, res) => {
  log('Test API endpoint called');
  res.json({ 
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// User registration endpoint
router.post('/users/register', (req, res) => {
  const { walletAddress, provider } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  // In a real app, you would save this to a database
  log(`Registered user with wallet: ${walletAddress} using ${provider}`);
  
  res.status(201).json({ 
    message: 'User registered successfully',
    user: {
      walletAddress,
      provider,
      registeredAt: new Date().toISOString()
    }
  });
});

export default router;
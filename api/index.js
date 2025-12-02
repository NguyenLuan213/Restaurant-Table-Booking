// Vercel Serverless Function wrapper for Express app
import app from '../server/index.js';
import { connectDatabase } from '../server/config/database.js';

// Ensure database is connected before handling requests
let dbConnected = false;

export default async function handler(req, res) {
  // Connect database if not already connected
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  // Handle request with Express app
  return app(req, res);
}


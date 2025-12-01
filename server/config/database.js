import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'restaurant_db';

let client = null;
let db = null;

export async function connectDatabase() {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Đã kết nối MongoDB thành công');
    }
    
    if (!db) {
      db = client.db(DATABASE_NAME);
    }
    
    return db;
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database chưa được kết nối. Gọi connectDatabase() trước.');
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ Đã đóng kết nối MongoDB');
  }
}


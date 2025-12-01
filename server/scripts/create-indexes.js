import { connectDatabase, getDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createIndexes() {
  try {
    const db = await connectDatabase();

    console.log('📊 Đang tạo indexes...');

    // Indexes cho bookings
    await db.collection('bookings').createIndex({ date: 1, time: 1 });
    await db.collection('bookings').createIndex({ email: 1 });
    await db.collection('bookings').createIndex({ createdAt: -1 });
    await db.collection('bookings').createIndex({ tableId: 1 });
    console.log('✅ Đã tạo indexes cho bookings');

    // Indexes cho tables
    await db.collection('tables').createIndex({ tableNumber: 1 }, { unique: true });
    await db.collection('tables').createIndex({ location: 1, isAvailable: 1 });
    console.log('✅ Đã tạo indexes cho tables');

    // Indexes cho menu_items
    await db.collection('menu_items').createIndex({ category: 1 });
    await db.collection('menu_items').createIndex({ isAvailable: 1 });
    await db.collection('menu_items').createIndex({ name: 'text', description: 'text' });
    console.log('✅ Đã tạo indexes cho menu_items');

    // Indexes cho settings
    await db.collection('settings').createIndex({ type: 1 }, { unique: true });
    console.log('✅ Đã tạo indexes cho settings');

    console.log('\n🎉 Tạo indexes hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo indexes:', error);
    process.exit(1);
  }
}

createIndexes();


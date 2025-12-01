import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, getDatabase, closeDatabase } from './config/database.js';
import bookingsRouter from './routes/bookings.js';
import tablesRouter from './routes/tables.js';
import menuRouter from './routes/menu.js';
import settingsRouter from './routes/settings.js';
import availabilityRouter from './routes/availability.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server đang hoạt động' });
});

// API Routes với prefix /api
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/menu', menuRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/availability', availabilityRouter);

// Route để tương thích với frontend hiện tại (giữ nguyên path cũ)
app.use('/make-server-8ce40ac3/bookings', bookingsRouter);
app.use('/make-server-8ce40ac3/tables', tablesRouter);
app.use('/make-server-8ce40ac3/menu', menuRouter);
app.use('/make-server-8ce40ac3/settings', settingsRouter);
app.use('/make-server-8ce40ac3/availability', availabilityRouter);

// Route cho available-tables (tương thích với frontend)
app.get('/make-server-8ce40ac3/available-tables', async (req, res) => {
  try {
    const { date, time, guests, preference } = req.query;
    const db = getDatabase();

    if (!date || !time || !guests || !preference) {
      return res.status(400).json({ error: 'Thiếu tham số truy vấn' });
    }

    // Lấy tất cả bàn
    const allTables = await db.collection('tables').find({}).toArray();

    // Lấy đặt bàn cho ngày và giờ này
    const bookings = await db.collection('bookings').find({
      date,
      time,
      tableId: { $exists: true, $ne: null }
    }).toArray();

    const bookedTableIds = bookings.map(b => b.tableId);

    // Lọc bàn có sẵn
    const availableTables = allTables
      .filter(table => {
        const tableId = table._id.toString();
        return (
          table.isAvailable &&
          table.location === preference &&
          table.capacity >= parseInt(guests) &&
          !bookedTableIds.includes(tableId)
        );
      })
      .sort((a, b) => a.tableNumber - b.tableNumber)
      .map(table => ({
        id: table._id.toString(),
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location,
        isAvailable: table.isAvailable,
        description: table.description || ''
      }));

    res.json({ tables: availableTables });
  } catch (error) {
    console.error('❌ Lỗi lấy bàn có sẵn:', error);
    res.status(500).json({ error: 'Lấy bàn có sẵn thất bại' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Lỗi server:', err);
  res.status(500).json({ error: 'Lỗi server nội bộ' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy route' });
});

// Start server
async function startServer() {
  try {
    // Kết nối database
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Đang tắt server...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Đang tắt server...');
  await closeDatabase();
  process.exit(0);
});

startServer();


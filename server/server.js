// 기존 코드 대신 dotenv 설정을 추가합니다
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware 순서 중요
app.use(cors());

// Stripe webhook 라우트를 위한 raw body parser
app.use('/api/transactions/webhook', express.raw({ type: 'application/json' }));

// 나머지 라우트를 위한 JSON parser
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 업로드 디렉토리 생성
const fs = require('fs');
const uploadDirs = ['uploads/pdfs', 'uploads/covers'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB에 연결되었습니다");
  })
  .catch((err) => {
    console.log("MongoDB 연결 오류:", err.message);
  });

// 연결 에러 처리를 무시
mongoose.connection.on("error", (err) => {
  console.log("MongoDB 연결 오류:", err.message);
});

// Routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 실행 중입니다" });
});

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error('서버 에러:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    message: err.message || '서버 오류가 발생했습니다',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
});
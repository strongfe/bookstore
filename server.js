// 기존 코드 대신 dotenv 설정을 추가합니다
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const { authMiddleware } = require("./middleware/auth");
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect("mongodb://localhost:27017/bookmarketplace")
  .then(() => {
    console.log("MongoDB에 연결되었습니다");
  })
  .catch((err) => {
    // 에러가 발생해도 서버는 계속 실행되도록 함
    console.log("MongoDB 연결 오류:", err.message);
  });

// 연결 에러 처리를 무시
mongoose.connection.on("error", (err) => {
  console.log("MongoDB 연결 오류:", err.message);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 실행 중입니다" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
});
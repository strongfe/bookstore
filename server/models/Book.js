const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "책 제목은 필수입니다"],
    trim: true
  },
  author: {
    type: String,
    required: [true, "저자명은 필수입니다"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "책 설명은 필수입니다"]
  },
  price: {
    type: Number,
    required: [true, "가격은 필수입니다"],
    min: [0, "가격은 0보다 커야 합니다"]
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coverImage: {
    type: String,
    default: "default-book-cover.jpg"
  },
  category: {
    type: String,
    required: [true, "카테고리는 필수입니다"]
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Book", bookSchema); 
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "구매자 정보는 필수입니다"]
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "도서 정보는 필수입니다"]
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "판매자 정보는 필수입니다"]
  },
  price: {
    type: Number,
    required: [true, "구매 가격은 필수입니다"]
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  },
  paymentId: {
    type: String,
    required: [true, "결제 ID는 필수입니다"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Purchase", purchaseSchema); 
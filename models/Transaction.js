const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "사용자 정보는 필수입니다"]
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "책 정보는 필수입니다"]
  },
  type: {
    type: String,
    required: true,
    enum: ["purchase", "refund"]
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  description: String,
  paymentDetails: {
    paymentId: String,
    paymentProvider: String
  }
}, {
  timestamps: true
});

console.log('Transaction Schema:', transactionSchema.obj);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction; 
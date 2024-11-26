const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "사용자 정보는 필수입니다"]
  },
  type: {
    type: String,
    enum: ["purchase", "sale", "refund"],
    required: [true, "거래 유형은 필수입니다"]
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "도서 정보는 필수입니다"]
  },
  amount: {
    type: Number,
    required: [true, "거래 금액은 필수입니다"]
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    required: [true, "결제 방법은 필수입니다"]
  },
  paymentDetails: {
    paymentId: String,
    paymentProvider: String,
    receiptUrl: String
  },
  description: {
    type: String,
    required: [true, "거래 설명은 필수입니다"]
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// 인덱스 생성
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ book: 1 });
transactionSchema.index({ status: 1 });

// 가상 필드: 거래 ID 생성
transactionSchema.virtual('transactionId').get(function() {
  return `TRX${this._id.toString().slice(-6).toUpperCase()}`;
});

// 거래 상태 변경 메소드
transactionSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// 환불 처리 메소드
transactionSchema.methods.processRefund = async function() {
  if (this.status !== 'completed') {
    throw new Error('완료된 거래만 환불할 수 있습니다.');
  }
  
  this.status = 'refunded';
  this.type = 'refund';
  return this.save();
};

module.exports = mongoose.model("Transaction", transactionSchema); 
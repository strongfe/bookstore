const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "제목은 필수입니다"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "저자는 필수입니다"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "설명은 필수입니다"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "가격은 필수입니다"],
      min: [0, "가격은 0보다 커야 합니다"],
    },
    category: {
      type: String,
      required: [true, "카테고리는 필수입니다"],
      enum: ["소설", "시", "에세이", "자기계발", "경제/경영", 
             "인문/사회", "과학/공학", "컴퓨터/IT", "외국어", "기타"],
    },
    coverImage: {
      type: String,
      required: [true, "표지 이미지는 필수입니다"],
    },
    pdf: {
      type: String,
      required: [true, "PDF 파일은 필수입니다"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 검색을 위한 인덱스 생성
bookSchema.index({ title: "text", author: "text", description: "text" });

// 가상 필드: 평균 평점 계산
bookSchema.virtual("averageRating").get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

module.exports = mongoose.model("Book", bookSchema);

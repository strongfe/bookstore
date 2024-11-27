const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Book = require('../models/Book');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

// 새로운 거래 생성
exports.createTransaction = async (req, res) => {
  try {
    const { bookId, paymentMethod } = req.body;
    const userId = req.user.id;

    console.log('Transaction Creation Start:', {
      bookId,
      paymentMethod,
      userId,
      userObject: req.user,
      headers: req.headers
    });

    // userId 유효성 검사
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId:', userId);
      return res.status(400).json({ 
        message: "유효하지 않은 사용자 ID입니다.",
        debug: { userId, userObject: req.user }
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      console.log('책을 찾을 수 없음:', bookId);
      return res.status(404).json({ message: "책을 찾을 수 없습니다." });
    }

    console.log('찾은 책 정보:', book);

    // Stripe 결제 의도 생성
    const paymentIntent = await stripe.paymentIntents.create({
      amount: book.price * 100,
      currency: 'krw',
      customer: req.user.stripeCustomerId,
      metadata: {
        bookId: bookId,
        userId: userId
      }
    });

    console.log('Stripe 결제 의도 생성됨:', paymentIntent.id);

    // 거래 생성 전 데이터 확인
    const transactionData = {
      user: userId,
      book: bookId,
      type: 'purchase',
      amount: book.price,
      paymentMethod,
      description: `${book.title} 구매`,
      paymentDetails: {
        paymentId: paymentIntent.id,
        paymentProvider: 'stripe',
      }
    };

    console.log('거래 생성 시도:', transactionData);

    // 거래 기록 생성
    const transaction = await Transaction.create(transactionData);

    console.log('거래 생성 완료:', transaction);

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      transaction: transaction
    });
  } catch (error) {
    console.error('Transaction Creation Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      user: req.user
    });
    
    res.status(500).json({ 
      message: "거래 생성 중 오류가 발생했습니다.", 
      error: error.message,
      details: error.errors,
      debug: {
        userId: req.user?.id,
        userObject: req.user
      }
    });
  }
};

// 거래 완료 처리
exports.completeTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "거래를 찾을 수 없습니다." });
    }

    // 거래 상태 업데이트
    await transaction.updateStatus('completed');

    // 구매자의 구매 목록에 책 추가
    await User.findByIdAndUpdate(transaction.user, {
      $push: { purchasedBooks: transaction.book }
    });

    // 책의 구매 수 증가
    await Book.findByIdAndUpdate(transaction.book, {
      $inc: { purchaseCount: 1 }
    });

    res.json({ message: "거래가 완료되었습니다.", transaction });
  } catch (error) {
    res.status(500).json({ message: "거래 완료 처리 중 오류가 발생했습니다.", error: error.message });
  }
};

// 거래 내역 조회
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId })
      .populate('book', 'title price')
      .sort('-createdAt');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "거래 내역 조회 중 오류가 발생했습니다.", error: error.message });
  }
};

// 환불 처리
exports.processRefund = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "거래를 찾을 수 없습니다." });
    }

    // Stripe 환불 처리
    const refund = await stripe.refunds.create({
      payment_intent: transaction.paymentDetails.paymentId
    });

    // 거래 상태 업데이트
    await transaction.processRefund();

    // 구매자의 구매 목록에서 책 제거
    await User.findByIdAndUpdate(transaction.user, {
      $pull: { purchasedBooks: transaction.book }
    });

    res.json({ message: "환불이 처리되었습니다.", refund });
  } catch (error) {
    res.status(500).json({ message: "환불 처리 중 오류가 발생했습니다.", error: error.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `웹훅 에러: ${err.message}` });
  }

  // 이벤트 타입에 따른 처리
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // 결제 성공 시 거래 완료 처리
      await Transaction.findOneAndUpdate(
        { 'paymentDetails.paymentId': paymentIntent.id },
        { status: 'completed' }
      );
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // 결제 실패 시 거래 실패 처리
      await Transaction.findOneAndUpdate(
        { 'paymentDetails.paymentId': failedPayment.id },
        { status: 'failed' }
      );
      break;
  }

  res.json({ received: true });
}; 
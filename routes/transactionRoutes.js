const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

// 인증이 필요한 라우트들
router.use(authMiddleware);

// 거래 생성
router.post('/', transactionController.createTransaction);

// 거래 완료
router.put('/:transactionId/complete', transactionController.completeTransaction);

// 거래 내역 조회
router.get('/', transactionController.getUserTransactions);

// 환불 처리
router.post('/:transactionId/refund', transactionController.processRefund);

// Stripe 웹훅 (인증 미들웨어 제외)
router.post('/webhook', express.raw({type: 'application/json'}), transactionController.handleStripeWebhook);

module.exports = router; 
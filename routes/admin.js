const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { adminAuthMiddleware } = require('../middleware/adminAuth');

// 모든 사용자 조회 라우트
router.get('/users', auth, adminAuthMiddleware, adminController.getAllUsers);

// 다른 관리자 라우트들도 추가
router.delete('/users/:id', auth, adminAuthMiddleware, adminController.deleteUser);
router.get('/books', auth, adminAuthMiddleware, adminController.getAllBooks);
router.get('/books/:id', auth, adminAuthMiddleware, adminController.getBookById);
router.delete('/books/:id', auth, adminAuthMiddleware, adminController.deleteBook);
router.get('/transactions', auth, adminAuthMiddleware, adminController.getAllTransactions);
router.get('/transactions/:id', auth, adminAuthMiddleware, adminController.getTransactionById);
router.put('/users/:id/role', auth, adminAuthMiddleware, adminController.updateUserRole);

module.exports = router; 
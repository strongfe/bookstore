const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
    getAllUsers,
    getAllBooks,
    getAllTransactions,
    deleteUser,
    deleteBook
} = require('../controllers/adminController');

// 관리자 전용 라우트
router.get('/users', authMiddleware, getAllUsers);
router.get('/books', authMiddleware, getAllBooks);
router.get('/transactions', authMiddleware, getAllTransactions);
router.delete('/users/:userId', authMiddleware, deleteUser);
router.delete('/books/:bookId', authMiddleware, deleteBook);

module.exports = router; 
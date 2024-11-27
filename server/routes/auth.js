const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
    register,
    login,
    updateProfile,
    changePassword,
    getUploadedBooks,
    getPurchasedBooks,
    getTransactions 
} = require('../controllers/userController');

// 인증이 필요하지 않은 라우트
router.post('/register', register);
router.post('/login', login);

// 인증이 필요한 라우트
router.get('/profile', authMiddleware, (req, res) => {
    // 프로필 처리 로직
});
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.get('/uploaded-books', authMiddleware, getUploadedBooks);
router.get('/purchased-books', authMiddleware, getPurchasedBooks);
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;

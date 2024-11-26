const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile,
    updateProfile,
    changePassword,
    getUploadedBooks,
    getPurchasedBooks,
    getTransactions
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// 인증이 필요하지 않은 라우트
router.post('/register', register);
router.post('/login', login);

// 인증이 필요한 라우트
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/uploaded-books', auth, getUploadedBooks);
router.get('/purchased-books', auth, getPurchasedBooks);
router.get('/transactions', auth, getTransactions);

module.exports = router;

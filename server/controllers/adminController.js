const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// 모든 사용자 조회
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 모든 책 조회
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('seller', 'username email');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 모든 거래 내역 조회
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('buyer', 'username email')
            .populate('seller', 'username email')
            .populate('book', 'title price');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 사용자 삭제
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: '사용자가 삭제되었습니다' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 책 삭제
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.bookId);
        res.json({ message: '책이 삭제되었습니다' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
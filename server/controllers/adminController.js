const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

const adminController = {
  // 사용자 관리
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ 
          message: '사용자를 찾을 수 없습니다.' 
        });
      }
      res.json({ 
        message: '사용자가 성공적으로 삭제되었습니다.',
        deletedUser: user 
      });
    } catch (error) {
      res.status(500).json({ 
        message: '사용자 삭제에 실패했습니다.' 
      });
    }
  },

  // 책 관리
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find().populate('author', 'username email');
      res.json(books);
    } catch (error) {
      res.status(500).json({ 
        message: '책 목록을 가져오는데 실패했습니다.' 
      });
    }
  },

  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
        .populate('author', 'username email');
      if (!book) {
        return res.status(404).json({ 
          message: '책을 찾을 수 없습니다.' 
        });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ 
        message: '책 정보를 가져오는데 실패했습���다.' 
      });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ 
          message: '책을 찾을 수 없습니다.' 
        });
      }
      res.json({ 
        message: '책이 성공적으로 삭제되었습니다.',
        deletedBook: book 
      });
    } catch (error) {
      res.status(500).json({ 
        message: '책 삭제에 실패했습니다.' 
      });
    }
  },

  // 거래 관리
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find()
        .populate('buyer', 'username email')
        .populate('book', 'title price');
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ 
        message: '거래 내역을 가져오는데 실패했습니다.' 
      });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate('buyer', 'username email')
        .populate('book', 'title price');
      if (!transaction) {
        return res.status(404).json({ 
          message: '거래 내역을 찾을 수 없습니다.' 
        });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ 
        message: '거래 내역을 가져오는데 실패했습니다.' 
      });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // role 값 검증
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ 
          message: "유효하지 않은 역할입니다. 'user' 또는 'admin'만 가능합니다." 
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      res.json({ 
        message: "사용자 역할이 업데이트되었습니다.",
        user 
      });
    } catch (error) {
      console.error('역할 업데이트 에러:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
};

module.exports = adminController; 
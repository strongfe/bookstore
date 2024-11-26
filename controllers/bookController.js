const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true })
      .select('-pdf')
      .populate('seller', 'username email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.find({ 
      category: req.params.category,
      isActive: true 
    }).select('-pdf');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).select('-pdf');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .select('-pdf')
      .populate('seller', 'username email');
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = new Book({
      ...req.body,
      seller: req.user.id,
      coverImage: req.files.coverImage[0].path,
      pdf: req.files.pdf[0].path
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다' });
    }

    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    const updateData = { ...req.body };
    if (req.files.coverImage) {
      updateData.coverImage = req.files.coverImage[0].path;
    }
    if (req.files.pdf) {
      updateData.pdf = req.files.pdf[0].path;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다' });
    }

    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    // 실제로 삭제하지 않고 비활성화
    book.isActive = false;
    await book.save();
    
    res.json({ message: '책이 성공적으로 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ 
      seller: req.user.id,
      isActive: true 
    }).select('-pdf');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

exports.getPurchasedBooks = async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate({
        path: 'book',
        select: '-pdf'
      });
    res.json(purchases.map(purchase => purchase.book));
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
}; 
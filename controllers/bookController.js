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
  console.log("Hello World - POST /api/books 요청이 들어왔습니다!");
  console.log("요청 헤더:", req.headers);
  console.log("요청 사용자:", req.user);
  
  try {
    // 1. 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('유효성 검사 오류:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // 2. 요청 데이터 로깅
    console.log('요청 본문:', req.body);
    console.log('업로드된 파일:', req.files);

    // 3. 기본 책 데이터 생성
    const bookData = {
      ...req.body,
      seller: req.user.id
    };

    // 4. 파일이 있는 경우에만 파일 경로 추가
    if (req.files) {
      if (req.files.coverImage) {
        bookData.coverImage = req.files.coverImage[0].path;
      }
      if (req.files.pdf) {
        bookData.pdf = req.files.pdf[0].path;
      }
    }

    // 5. 책 생성
    const book = new Book(bookData);

    // 6. 저장 시도
    console.log('저장 시도할 책 데이터:', book);
    await book.save();
    
    res.status(201).json(book);
  } catch (error) {
    // 7. 자세한 에러 정보 로깅
    console.error('책 생성 중 오류 발생:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다',
      error: {
        message: error.message,
        type: error.name
      }
    });
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
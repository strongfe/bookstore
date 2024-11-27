const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// 책 생성을 위한 유효성 검사 규칙
const bookValidation = [
  check('title').notEmpty().withMessage('제목은 필수입니다'),
  check('author').notEmpty().withMessage('저자는 필수입니다'),
  check('description').notEmpty().withMessage('설명은 필수입니다'),
  check('price').isNumeric().withMessage('가격은 숫자여야 합니다'),
  check('category').notEmpty().withMessage('카테고리는 필수입니다'),
];

// 공개 접근 가능한 라우트
router.get('/', bookController.getAllBooks);                    // 모든 책 조회
router.get('/category/:category', bookController.getBooksByCategory);  // 카테고리별 책 조회
router.get('/search', bookController.searchBooks);              // 책 검색
router.get('/:id', bookController.getBookById);                // 특정 책 상세 조회

// 인증이 필요한 라우트
router.post('/', 
  authMiddleware, 
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  bookValidation,
  bookController.createBook
);                                 // 새 책 등록

router.put('/:id', [
  authMiddleware,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  ...bookValidation
], bookController.updateBook);                                 // 책 정보 수정

router.delete('/:id', authMiddleware, bookController.deleteBook);        // 책 삭제
router.get('/user/my-books', authMiddleware, bookController.getMyBooks); // 내가 등록한 책 조회
router.get('/user/purchased', authMiddleware, bookController.getPurchasedBooks); // 구매한 책 조회

module.exports = router; 
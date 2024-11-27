const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // 토큰 확인
    console.log('Authorization Header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
      console.log('토큰이 없음');
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // 사용자 정보 조회
    const user = await User.findById(decoded.userId);
    console.log('Found User:', user);

    if (!user) {
      console.log('사용자를 찾을 수 없음');
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    req.user = user;
    console.log('Request User Set:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: '인증에 실패했습니다.', error: error.message });
  }
};

module.exports = authMiddleware; 
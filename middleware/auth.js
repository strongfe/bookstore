const jwt = require('jsonwebtoken');

// 미들웨어 함수 정의
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: '인증이 필요합니다' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: '인증 실패' });
    }
};

// 함수를 직접 내보내기
module.exports = authMiddleware; 
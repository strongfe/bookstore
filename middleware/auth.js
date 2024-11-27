const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('환경변수 확인:', {
            JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
            JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
            JWT_SECRET_VALUE: process.env.JWT_SECRET
        });

        const authHeader = req.header('Authorization');
        console.log('Authorization 헤더:', authHeader);
        
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: '인증이 필요합니다' });
        }
        
        const decodedWithoutVerification = jwt.decode(token);
        console.log('검증 전 토큰 내용:', decodedWithoutVerification);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('검증된 토큰:', decoded);

        req.user = {
            id: decoded.userId
        };
        next();
    } catch (error) {
        console.error('인증 미들웨어 오류:', {
            name: error.name,
            message: error.message,
            tokenHeader: req.header('Authorization'),
            envSecret: process.env.JWT_SECRET
        });
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: '유효하지 않은 토큰입니다',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        
        res.status(401).json({ message: '인증 실패' });
    }
};

module.exports = authMiddleware; 
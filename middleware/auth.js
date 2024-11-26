const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: "인증이 필요합니다" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "인증에 실패했습니다" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin && req.user.role !== 'admin') {
            return res.status(403).json({ message: "관리자 권한이 필요합니다" });
        }
        next();
    } catch (error) {
        res.status(403).json({ message: "권한이 없습니다" });
    }
};

module.exports = { auth, isAdmin }; 
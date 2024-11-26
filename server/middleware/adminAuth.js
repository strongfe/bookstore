const User = require('../models/User');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // req.user는 이전 authMiddleware에서 설정됨
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // isAdmin 또는 role이 'admin'인 경우 접근 허용
        if (user.isAdmin === true || user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }
    } catch (error) {
        console.error('관리자 권한 확인 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = { adminAuthMiddleware }; 
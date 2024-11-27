const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                success: false,
                message: '비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.' 
            });
        }
        
        // 이메일 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: '이미 등록된 이메일입니다' 
            });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 새 사용자 생성
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        
        res.status(201).json({ 
            success: true,
            message: '회원가입이 완료되었습니다' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('로그인 시도:', { email, passwordLength: password?.length });

        // 1. 입력값 검증
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '이메일과 비밀번호를 모두 입력해주세요.'
            });
        }

        // 2. 사용자 찾기
        const user = await User.findOne({ email });
        console.log('사용자 조회 결과:', user ? '사용자 찾음' : '사용자 없음');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 3. 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('비밀번호 검증 결과:', isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 4. 사용자 권한 확인
        const userRole = user.role || 'user';
        const isAdmin = user.isAdmin === true || userRole === 'admin';

        // 5. JWT 토큰 생성
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                role: userRole,
                isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 6. 응답 데이터 구성
        const responseData = {
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: userRole,
                isAdmin,
                createdAt: user.createdAt
            },
            message: '로그인에 성공했습니다.'
        };

        console.log('로그인 성공:', { userId: user._id, email: user.email });
        res.status(200).json(responseData);

    } catch (error) {
        console.error('로그인 처리 중 에러 발생:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false,
            message: '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        
        res.json({ message: '비밀번호가 변경되었습니다' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUploadedBooks = async (req, res) => {
    try {
        const books = await Book.find({ seller: req.user.userId });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPurchasedBooks = async (req, res) => {
    try {
        const books = await Book.find({ 
            _id: { $in: req.user.purchasedBooks } 
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { buyer: req.user.userId },
                { seller: req.user.userId }
            ]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

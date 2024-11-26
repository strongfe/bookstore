const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 이메일 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '이미 등록된 이메일입니다' });
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
        
        res.status(201).json({ message: '회원가입이 완료되었습니다' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 사용자 찾기
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
        }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

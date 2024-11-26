const User = require("../models/User");
const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const Transaction = require("../models/Transaction");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // 이메일 중복 체크
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "이미 등록된 이메일입니다" });
    }

    // 사용자명 중복 체크
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "이미 사용 중인 사용자명입니다" });
    }

    // 새 사용자 생성
    user = new User({ username, email, password });
    await user.save();

    // 토큰 생성
    const token = user.generateAuthToken();
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
    }

    // 토큰 생성
    const token = user.generateAuthToken();
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePicture } = req.body;
    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "현재 비밀번호가 올바르지 않습니다" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "비밀번호가 성공적으로 변경되었습니다" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const getUploadedBooks = async (req, res) => {
  try {
    const books = await Book.find({ uploader: req.user.id })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const getPurchasedBooks = async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate('book')
      .select('-__v')
      .sort({ purchaseDate: -1 });
    
    const books = purchases.map(purchase => purchase.book);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { seller: req.user.id },
        { buyer: req.user.id }
      ]
    })
      .populate('book')
      .select('-__v')
      .sort({ transactionDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUploadedBooks,
  getPurchasedBooks,
  getTransactions
};

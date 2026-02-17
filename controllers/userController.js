const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
  const { name, email, password, bio, skills } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    bio,
    skills
  });

  res.status(201).json({
    message: "User registered successfully",
    user
  });
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "User logged in successfully",
    token
  });
};

exports.updateProfile = async (req, res) => {
  const { name, bio, skills } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.bio = bio || user.bio;
  user.skills = skills || user.skills;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    updatedUser
  });
};


exports.getUsers = async (req, res) => {
  const { skill, page = 1, limit = 5, sort } = req.query;

  let query = {};

  if (skill) {
    query.skills = { $in: [skill] };
  }

  const skip = (page - 1) * limit;

  let mongoQuery = User.find(query).select("-password");

  if (sort) {
    mongoQuery = mongoQuery.sort(sort);
  }

  const users = await mongoQuery
    .skip(skip)
    .limit(Number(limit));

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    totalUsers,
    currentPage: Number(page),
    totalPages: Math.ceil(totalUsers / limit),
    users
  });
};


exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
};


exports.deleteProfile = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    message: "Account deleted successfully"
  });
};
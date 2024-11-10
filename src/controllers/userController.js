const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Comments, Likes, User, Post } = require("../models");
const { uploadImage } = require("../utils/cloudinaryUploadHelper");

// Get all users with their likes and comments (restricted to super admin)
const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: [
        {
          model: Likes,
          required: true,
        },
        {
          model: Comments,
          required: true,
        },
      ],
    });
    res.status(200).json({
      message: "succeed",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a specific user by ID with their posts
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const getUser = await User.findOne({ where: { id }, include: Post });

    if (!getUser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({
      message: "succeed",
      data: getUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get posts by a specific user ID with likes and comments
const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const getPost = await Post.findAll({
      where: { userId: id },
      include: [
        {
          model: Likes,
          required: true,
        },
        {
          model: Comments,
          required: true,
        },
        {
          model: User,
          required: true,
        },
      ],
    });

    if (!getPost.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({
      message: "succeed",
      data: getPost,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// User login with JWT generation
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const getUser = await User.findOne({ where: { email } });

    if (!getUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const passwordMatch = await bcrypt.compare(password, getUser.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: getUser.id,
        firstName: getUser.firstName,
        lastName: getUser.lastName,
        email: getUser.email,
        image: getUser.image,
        role: getUser.role,
        points: getUser.points,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// User registration with bcrypt password hashing
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !gender) {
      return res.status(400).json({
        message: "All fields are required: firstName, lastName, email, password, gender",
      });
    }

    // Check if email is already registered
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "Email has already been registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      role: "user", // Role default to 'user'
    });

    res.status(201).json({
      message: "Account successfully registered",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Edit user profile (restricted to the user themself or super admin)
const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, password, gender } = req.body;
    const requesterId = req.credentials.id;
    const requesterRole = req.credentials.role;

    // Allow user to edit their own profile or super admin to edit any profile
    if (requesterRole !== "super admin" && requesterId != id) {
      return res.status(403).json({ message: "You are not authorized to edit this user's data" });
    }

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password if provided
    const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Handle profile image upload if a new image is provided
    let imageUrl = user.image;
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      imageUrl = uploadResult.url;
    }

    // Only allow updating of specific fields
    const updatedData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      password: updatedPassword,
      image: imageUrl,
      gender: gender || user.gender,
    };

    // Update the user
    const updatedUser = await user.update(updatedData);

    res.status(200).json({
      message: "User profile successfully updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getAllUser, getUserById, getPostById, register, login, editUser };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Comments, Likes, User, Post } = require("../models");

const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: [
        {
          model: Likes,
          require: true,
        },
        {
          model: Comments,
          require: true,
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

const getUserById = async (req, res) => {
  const id = req.params.id;
  const getUser = await User.findOne({ where: { id: id }, include: Post });

  if (!getUser) {
    res.status(404).json({
      message: "user not found",
    });
  }

  res.status(200).json({
    message: "succeed",
    data: getUser,
  });
};

const getPostById = async (req, res) => {
  const id = req.params.id;
  const getPost = await Post.findAll({
    where: { userId: id },
    include: [
      {
        model: Likes,
        require: true,
      },
      {
        model: Comments,
        require: true,
      },
      {
        model: User,
        require: true,
      },
    ],
  });

  if (!getPost) {
    res.status(404).json({
      message: "user not found",
    });
  }

  res.status(200).json({
    message: "succeed",
    data: getPost,
  });
};

const login = async (req, res) => {
  try {
    const data = req.body;
    const getUser = await User.findOne({ where: { email: data.email } });

    if (!getUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    bcrypt
      .compare(data.password, getUser.password)
      .then((result) => {
        if (result) {
          const token = jwt.sign(
            { id: getUser.id, firstName: getUser.firstName, lastName: getUser.lastName, email: getUser.email, image: getUser.image, role: getUser.role, points: getUser.points, iat: Math.floor(Date.now() / 3000 - 30) },
            process.env.JWT_SECRET
          );
          res.status(200).json({
            status: true,
            message: "Login Succesful",
            data: token,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Wrong Password",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: false,
          message: "Internal server error",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const register = async (req, res) => {
  try {
    const data = req.body;
    const userCheck = await User.findAll({ where: { email: data.email } });

    if (userCheck.length > 0) {
      res.status(406).json({
        message: "email has already been registered",
      });
      return;
    }

    let saltRounds = 10;

    bcrypt.hash(data.password, saltRounds, async (err, hash) => {
      const newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hash,
        gender: data.gender,
        role: data.role,
      };
      const addUser = await User.create(newUser);

      res.status(201).json({
        message: "account succesfully registered",
        data: addUser,
      });
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await User.findOne({ where: { id: id } });

    let saltRounds = 10;
    const hashPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(data.password, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });

    const editedUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPassword,
      image: data.image,
      gender: data.gender,
      role: data.role,
    };
    const edited = await user.update(editedUser, { where: { id: id } });

    res.status(201).json({
      message: "User has succesfully made a change",
      edited,
    });
  } catch (error) {
    res.status(404).json({
      message: "Internal Error",
    });
  }
};

module.exports = { getAllUser, getUserById, getPostById, register, login, editUser };

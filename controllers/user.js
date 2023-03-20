const UserService = require('../services/user');
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../model/user');
require('dotenv').config();

let userService = new UserService();
const createUser = async (req, res) => {
  const user = req.body;
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    let addUser = await userService.createUser(user);

    res
      .status(200)
      .json({ status: true, message: 'user created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.getUser(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.updateUser({ _id: userId }, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.deleteUser({ _id: userId });
    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const existingUser = await userService.getLoginUser({
      emailId: emailId
    });
    if (!existingUser) {
      res.status(401).json({
        status: false,
        message: 'invalid emailId or password'
      });
    } else {
      const matchPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!matchPassword) {
        return res.status(401).json({
          status: false,
          message: 'invalid emailId or password'
        });
      } else {
        const jwtToken = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET_KEY
        );

        res.status(200).json({
          status: true,
          message: 'loggined successfully!',
          token: jwtToken
        });
      }
    }
  } catch (error) {
    console.log('error = ', error);
    res.status(200).json({ status: false, message: error.message });
  }
};
module.exports = { createUser, getUser, deleteUser, updateUser, login };

import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

//  @desc      Auth User & Get Token
//  @post      /api/users/login
//  @access    public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      emai: user.emai,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

//  @desc      Regster a new user
//  @post      /api/users
//  @access    public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//  @desc      get user profile
//  @get       /api/users/profile
//  @access    private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(mongoose.Types.ObjectId(req.user._id));

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status("404");
    throw new Error("User Not Found");
  }
});

//  @desc      update user profile
//  @put      /api/users/profile
//  @access    private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(mongoose.Types.ObjectId(req.user._id));

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status("404");
    throw new Error("User Not Found");
  }
});

//  @desc      Get all users
//  @get       /api/users
//  @access    private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//  @desc      Delete user
//  @delete    /api/users/:id
//  @access    private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(mongoose.Types.ObjectId(req.params.id));
  if (user) {
    await user.remove();
    res.json({ message: "user removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//  @desc      Get user by id
//  @get       /api/users/:id
//  @access    private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(
    mongoose.Types.ObjectId(req.params.id)
  ).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//  @desc      get user profile
//  @put       /api/users/:id
//  @access    private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(mongoose.Types.ObjectId(req.params.id));

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.isAdmin) {
      user.isAdmin = req.body.isAdmin;
    } else {
      user.isAdmin = false;
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status("404");
    throw new Error("User Not Found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};

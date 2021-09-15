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
      emai: user.emai,
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
      emai: user.emai,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status("404");
    throw new Error("User Not Found");
  }
});

export { authUser, registerUser, getUserProfile };

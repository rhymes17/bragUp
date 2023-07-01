import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc Register a user
// @route "/api/users/register"
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  //Check if user already exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(500);
    throw new Error("User already exists");
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create the new user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  user.following.push({
    user: user._id,
  });

  const updatedUser = await user.save();

  if (updatedUser) {
    generateToken(res, updatedUser._id);

    res.status(201).json({
      username,
      _id: updatedUser._id,
      email,
      bio: updatedUser.bio,
      dp: updatedUser.dp,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Input");
  }

  res.json("eorking");
});

// @desc Login a user
// @route "/api/users/login"
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  //Find the user
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);

    res.status(200).json({
      username,
      _id: user._id,
      email: user.email,
      bio: user.bio,
      dp: user.dp,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials!");
  }
});

// @desc Logout a user
// @route '/api/users/logout'
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json("Logged out successfully");
});

// @desc Get User Profile
// @route '/api/:username'
// @Access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (user) {
    res.status(200).json({
      username: user.username,
      _id: user._id,
      email: user.email,
      bio: user.bio,
      dp: user.dp,
      followers: user.followers,
      following: user.following,
      name: user.name,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Edit Profile
// @route /api/:username/edit'
// Access Private
export const editProfile = asyncHandler(async (req, res) => {
  const { bio, imgURL, name, email, password } = req.body;

  const user = await User.findOne({ username: req.user.username });

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    if (imgURL) {
      user.dp = imgURL;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const updatedPassword = await bcrypt.hash(password, salt);

      user.password = updatedPassword;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      username: updatedUser.username,
      _id: updatedUser._id,
      email: updatedUser.email,
      bio: updatedUser.bio,
      name: updatedUser.name,
      dp: updatedUser.dp,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Add a following
// @route PUT '/api/users/:username/folow'
// @access Private
export const follow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const friend = await User.findOne({ username: req.params.username });

    const alreadyFollow = user.following.some(
      (following) => following.user.toString() === friend._id.toString()
    );

    if (alreadyFollow) {
      res.status(500);
      throw new Error("Already following!");
    }

    if (friend) {
      const followingUser = {
        user: friend._id,
      };

      // Check if the friend is already in the user's followers list
      const alreadyFollower = friend.followers.some(
        (follower) => follower.user.toString() === user._id.toString()
      );

      if (alreadyFollower) {
        res.status(500);
        throw new Error("Already a follower!");
      }
      const followerUser = {
        user: user._id,
      };
      friend.followers.push(followerUser);
      user.following.push(followingUser);

      const updatedUser = await user.save();
      const updatedFriend = await friend.save();

      await User.populate(updatedUser, {
        path: "followers.user following.user",
        select: "username",
      });

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        dp: updatedUser.dp,
        followers: updatedUser.followers,
        following: updatedUser.following,
      });
    } else {
      res.status(404);
      throw new Error("Friend not found");
    }
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc Remove a following
// @route PUT '/api/users/:username/unfollow'
// @access Private
export const unfollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const friend = await User.findOne({ username: req.params.username });

    const alreadyFollow = user.following.some(
      (following) => following.user.toString() === friend._id.toString()
    );

    if (!alreadyFollow) {
      res.status(500);
      throw new Error("Not following!");
    }

    if (friend) {
      // Remove friend from user's following list
      user.following = user.following.filter(
        (following) => following.user.toString() !== friend._id.toString()
      );

      // Remove user from friend's followers list
      friend.followers = friend.followers.filter(
        (follower) => follower.user.toString() !== user._id.toString()
      );

      const updatedUser = await user.save();
      const updatedFriend = await friend.save();

      await User.populate(updatedUser, {
        path: "followers.user following.user",
        select: "username",
      });

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        dp: updatedUser.dp,
        followers: updatedUser.followers,
        following: updatedUser.following,
      });
    } else {
      res.status(404);
      throw new Error("Friend not found");
    }
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Already following
// GET '/api/users/:username/alreadyFollowing
export const alreadyFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const friend = await User.findOne({ username: req.params.username });

    const alreadyFollow = user.following.some(
      (following) => following.user.toString() === friend._id.toString()
    );

    res.status(200).json(alreadyFollow);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Search User
// @route GET '/api/users/search'
// @access Private
export const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  try {
    const searchResults = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Search by username (case-insensitive)
        { name: { $regex: query, $options: "i" } }, // Search by name (case-insensitive)
      ],
    })
      .select("username name dp")
      .exec();

    res.json(searchResults);
  } catch (error) {
    res.status(500);
    throw new Error("User not found");
  }
});

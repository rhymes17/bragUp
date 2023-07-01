import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

// @desc   Get all Posts
// @route  GET '/api/posts/'
// @access Private
export const getAllPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the current user
  const currentUser = await User.findById(userId);

  if (!currentUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Get the array of users that the current user is following
  const following = currentUser.following.map((follow) => follow.user);

  // Find posts where the user is in the 'following' array
  const posts = await Post.find({ user: { $in: following } })
    .sort({ createdAt: -1 })
    .populate("user")
    .populate("comments.user")
    .exec();

  const formattedPosts = posts.map((post) => ({
    ...post._doc,
    createdAt: post.createdAt.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  }));

  res.status(200).json(formattedPosts);
});

// @desc   Create a new post
// @route  POST '/api/posts/'
// @access Private
export const createPost = asyncHandler(async (req, res) => {
  const { caption, imgURL } = req.body;
  const user = req.user;

  if (user) {
    if (!caption || !imgURL) {
      res.status(400);
      throw new Error("Please include all fields");
    }

    const post = new Post({
      imgURL,
      caption,
      user: user._id,
    });

    const createdPost = await post.save();

    res.status(201).json(createdPost);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Get all posts of a user
// @route  GET '/api/posts/:username'
// @access Private
export const getMyPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (user) {
    const posts = await Post.find({ user: user._id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

// @desc Like a post
// @route PUT '/api/posts/:postId/like'
// @access Private
export const like = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const post = await Post.findById(req.params.postId).populate("user").exec();

    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      res.status(500);
      throw new Error("Already Liked!");
    }

    if (post) {
      const likedUser = {
        user: user._id,
      };

      post.likes.push(likedUser);

      const updatedPost = await post.save();

      res.status(200).json(updatedPost);
    } else {
      res.status(404);
      throw new Error("Friend not found");
    }
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @access Get A single Post
// @route '/api/posts/:postId'
// @access Private
export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user")
    .populate("comments.user")
    .exec();

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc Like a post
// @route PUT '/api/posts/:postId/unlike'
// @access Private
export const unlikePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  // Find the current user
  const currentUser = await User.findById(userId);

  if (!currentUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Find the post to unlike
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  // Check if the user has already liked the post
  const likedIndex = post.likes.findIndex(
    (like) => like.user.toString() === userId.toString()
  );

  // res.json(post.likes);

  if (likedIndex === -1) {
    res.status(400).json({ message: "Post has not been liked" });
    return;
  }

  // Remove the like from the post's likes array
  post.likes.splice(likedIndex, 1);

  // Save the updated post
  await post.save();

  res.status(200).json({ message: "Post unliked successfully" });
});

//already Liked
export const alreadyLiked = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const post = await Post.findById(req.params.postId).populate("user").exec();

    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === user._id.toString()
    );

    res.status(200).json(alreadyLiked);
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc Add a new comment
// @route POST '/api/posts/:postId/comment'
// @access Private
export const createComment = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Please include a comment!");
  }

  const post = await Post.findById(req.params.postId);
  const user = await User.findById(req.user._id);

  if (user) {
    if (post) {
      const comment = {
        user: user._id,
        message,
      };

      post.comments.push(comment);
      const updatedPost = await post.save();

      res.status(201).json(updatedPost);
    } else {
      res.status(404);
      throw new Error("Post not found!");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete a post
// @route DELETE '/api/posts/getPost/:postId'
// @access Private
export const deletePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.postId);

  if (post) {
    // res.json({
    //   post: post.user,
    //   user: req.user._id,
    // });
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(500);
      throw new Error("User not authorized to make this request!");
    }

    await Post.deleteOne({ _id: post._id });

    res.status(200).json({
      message: "Post Deleted Successfully!",
    });
  } else {
    res.status(404);
    throw new Error("Post not found!");
  }
});

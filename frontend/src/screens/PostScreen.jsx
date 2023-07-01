import React, { useEffect, useState } from "react";
import {
  useAlreadyLikedQuery,
  useDeletePostMutation,
  useGetPostQuery,
  useLikePostMutation,
  usePostCommentMutation,
  useUnlikePostMutation,
} from "../slices/postApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GoKebabHorizontal } from "react-icons/go";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const PostScreen = () => {
  const { postId } = useParams();
  const { data: post, isLoading, refetch } = useGetPostQuery(postId);

  //states
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [openDots, setOpenDots] = useState(false);
  const [mypost, setmypost] = useState(false);

  const navigate = useNavigate();

  //queries
  const [likePost, { isLoading: likeLoading }] = useLikePostMutation();

  const [unlikePost, { isLoading: unlikeLoading }] = useUnlikePostMutation();

  const { data: alreadyLiked, isLoading: alreadyLoading } =
    useAlreadyLikedQuery(postId);

  const { userInfo } = useSelector((state) => state.auth);

  const [postComment, { isLoading: commentLoading }] = usePostCommentMutation();

  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();

  //Render on change
  useEffect(() => {
    if (post) {
      setLiked(alreadyLiked);
      if (userInfo.username === post.user.username) {
        setmypost(true);
      }
    }
  }, [alreadyLiked, post]);

  //functions
  const handleDots = () => {
    setOpenDots((prevState) => {
      return !prevState;
    });
  };

  //handle Likes
  const handleLike = async () => {
    setLiked(true);
    try {
      const res = await likePost(post._id).unwrap();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleUnLike = async () => {
    setLiked(false);
    try {
      const res = await unlikePost(post._id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      postComment({ postId, message });

      refetch();
      // toast.success("Successfully added a new comment");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleDeletePost = async () => {
    try {
      deletePost(post._id);

      toast.success("Deleted the post successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const getDaysAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = now.getTime() - createdDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysDiff;
  };

  const getHoursAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = now.getTime() - createdDate.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert milliseconds to hours
    return hoursDiff;
  };

  if (isLoading || alreadyLoading) return <Loader />;

  return (
    <div className="flex flex-col w-[98%] rounded-[20px] lg:w-[30%] md:w-[50%] p-3 mx-auto bg-gradient-to-t from-[#4ddbd2]/30 to-[#4ddbd2]/20 text-white">
      <div className=" flex items-center justify-between relative w-[90%] mx-auto">
        <div className="flex items-center gap-3">
          <img
            className="h-[45px] object-cover cover w-[45px] rounded-full shadow-sm"
            src={post.user.dp}
            alt="profilePicture"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold tracking-wider">
              {post.user.username}
            </h3>
            {/* <p className="text-[0.7rem] text-gray-300">{post.createdAt}</p> */}
            {getDaysAgo(post.createdAt) > 0 ? (
              <p className="text-[0.7rem] text-gray-300">
                {getDaysAgo(post.createdAt)} d ago
              </p>
            ) : (
              <p className="text-[0.7rem] text-gray-300">
                {getHoursAgo(post.createdAt)} h ago
              </p>
            )}
          </div>
        </div>

        {mypost && (
          <div className="">
            <GoKebabHorizontal
              onClick={handleDots}
              className="text-xl cursor-pointer"
            />
            {openDots && (
              <div className="absolute top-6 rounded-lg right-4 z-10 flex flex-col text-center w-[150px] bg-gradient-to-t from-white/20 to-white/20 backdrop-blur-2xl">
                <button className="w-[90%] mx-auto" onClick={handleDeletePost}>
                  <p className="py-2 px-5 text-sm  cursor-pointer  border-gray-300/40">
                    Delete Post
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-[90%] mx-auto justify-center items-center flex mt-5 mb-3">
        <div className="image-container">
          <div className="box-shadow-container rounded-2xl aspect-w-1 aspect-h-1 max-h-[350px] md:max-h-[450px] overflow-hidden">
            <img className="rounded-2xl" src={post.imgURL} alt="Your Image" />
          </div>
        </div>
      </div>

      <div className="mb-4 w-[90%] mx-auto">
        <div className="flex gap-2">
          <h3 className="font-[400] tracking-wide text-white/90">
            {post.user.username}
          </h3>
          <p className="font-[300] text-white/90">{post.caption} </p>
        </div>
      </div>

      <div className="w-[90%] mx-auto flex gap-1">
        {/* Likes */}
        {liked ? (
          <motion.div
            onClick={handleUnLike}
            whileTap={{ scale: 0.9 }}
            className="flex items-center rounded-xl gap-1 py-2 px-2 bg-[#7B5DFB] border border-transparent cursor-pointer "
          >
            <AiFillHeart className="text-2xl liked" />
            <p>{post.likes.length}</p>
          </motion.div>
        ) : (
          <motion.div
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className="flex rounded-xl items-center gap-1  py-2 px-2 border border-[#7B5DFB] hover:bg-[#7B5DFB]/20 ani cursor-pointer"
          >
            <AiOutlineHeart className="text-2xl liked" />
            <p>{post.likes.length}</p>
          </motion.div>
        )}

        {/* Comments */}
        <div className="flex items-center rounded-xl gap-2 py-2 px-2 border border-transparent cursor-pointer ">
          <FaCommentAlt className="text-lg hover:text-[#7B5DFB] ani" />
          <p className="">{post.comments.length}</p>
        </div>
      </div>
      <div className="my-2 w-[90%] mx-auto  border-white/40 rounded-lg">
        {post.comments.length > 0 &&
          post.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-2 justify-between bg-gradient-to-l my-2 from-white/10 to-white/10 px-2 py-1 rounded-lg"
            >
              <div className="flex gap-3 md:max-w-[85%]">
                <div className="flex gap-2 min-w-[35%]">
                  <img
                    className="h-[35px]  md:block object-cover cover w-[35px] rounded-full shadow-sm"
                    src={comment.user.dp}
                    alt="profilePicture"
                  />
                  <div>
                    <h3 className="font-[400] tracking-wide text-white/90 ">
                      {comment.user.username}
                    </h3>
                  </div>
                </div>

                <p className="font-[300] text-white/90 ">{comment.message}</p>
              </div>

              <div className="hidden md:block">
                {getDaysAgo(comment.createdAt) > 0 ? (
                  <p className="font-[300] text-sm text-white/50">
                    {getDaysAgo(comment.createdAt)} h
                  </p>
                ) : (
                  <p className="font-[300] text-sm text-white/50">
                    {getHoursAgo(comment.createdAt)} h
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>

      <form
        className=" my-3 flex gap-2 justify-between items-center w-[85%] mx-auto py-1 px-3 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg"
        onSubmit={handleComment}
      >
        <input
          required
          className="bg-transparent placeholder:text-white/90 flex-1 focus:outline-none placeholder:font-[300] w-[70%] "
          placeholder="Type to add a comment..."
          defaultValue={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">
          <RiSendPlaneFill className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default PostScreen;

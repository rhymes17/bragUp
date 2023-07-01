import React, { useEffect, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCommentAlt } from "react-icons/fa";
import {
  useAlreadyLikedQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../slices/postApiSlice";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const [openDots, setOpenDots] = useState(false);
  const [liked, setLiked] = useState(false);

  const [likePost, { isLoading: likeLoading }] = useLikePostMutation();

  const [unlikePost, { isLoading: unlikeLoading }] = useUnlikePostMutation();

  const { data: alreadyLiked, isLoading } = useAlreadyLikedQuery(post._id);

  useEffect(() => {
    if (post) {
      setLiked(alreadyLiked);
    }
  }, [alreadyLiked]);

  //handle Dots
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

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (!post) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col w-[98%] rounded-[20px] lg:w-[30%] md:w-[50%] p-3 mx-auto bg-gradient-to-t from-[#4ddbd2]/30 to-[#4ddbd2]/20">
      <div className=" flex items-center justify-between relative w-[95%] mx-auto">
        <div className="flex items-center gap-3">
          <img
            className="h-[45px] object-cover cover w-[45px] rounded-full shadow-sm"
            src={post.user.dp}
            alt="profilePicture"
          />
          <div className="flex flex-col">
            <Link to={`/${post.user.username}`}>
              <h3 className="font-semibold tracking-wider">
                {post.user.username}
              </h3>
            </Link>
            <p className="text-[0.7rem] text-gray-300">{post.createdAt}</p>
          </div>
        </div>

        <div className="">
          <GoKebabHorizontal
            onClick={handleDots}
            className="text-xl cursor-pointer"
          />
          {openDots && (
            <div className="absolute top-6 rounded-lg right-4 z-10 flex flex-col text-center w-[130px] bg-gradient-to-t from-white/10 to-white/10 backdrop-blur-2xl">
              <div className="w-[90%] mx-auto">
                <Link to={`/posts/${post._id}`}>
                  <p className="py-2 px-5 text-sm  cursor-pointer border-b border-gray-300/40">
                    Visit Post
                  </p>
                </Link>
                <Link to={`/${post.user.username}`}>
                  <p className="py-2 px-5 text-sm  cursor-pointer">
                    Visit Profile
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
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
        <Link to={`/posts/${post._id}`}>
          <div className="flex items-center rounded-xl gap-2 py-2 px-2 border border-transparent cursor-pointer ">
            <FaCommentAlt className="text-lg hover:text-[#7B5DFB] ani" />
            <p className="">{post.comments.length}</p>
          </div>
        </Link>
      </div>
      <div className="my-2 w-[90%] mx-auto">
        {post.comments.length > 0 && (
          <div className="flex gap-2">
            <h3 className="font-[400] tracking-wide text-white/90">
              {post.comments[post.comments.length - 1].user.username}
            </h3>
            <p className="font-[300] text-white/90">
              {post.comments[post.comments.length - 1].message}
            </p>
          </div>
        )}

        <Link to={`/posts/${post._id}`}>
          <p className="text-sm my-1 text-gray-200/40 cursor-pointer">
            View all {post.comments.length} comments
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Post;

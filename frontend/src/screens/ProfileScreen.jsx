import React, { useEffect, useState } from "react";
import leet from "../assets/images/leet.png";
import { MdVerified, MdCancel } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAlreadyFollowQuery,
  useFollowUserMutation,
  useGetUserQuery,
  useUnfollowUserMutation,
} from "../slices/usersApiSlice";
import ProfilePosts from "../components/ProfilePosts";
import { useGetMyPostsQuery } from "../slices/postApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const ProfileScreen = () => {
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const { username } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: userProfile, isLoading: infoLoading } =
    useGetUserQuery(username);

  const { data: userPosts, isLoading: postsLoading } =
    useGetMyPostsQuery(username);

  const { data: alreadyFollow, isFollowing } = useAlreadyFollowQuery(username);

  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();

  const [unfollowUser, { isLoading: unfollowLoading }] =
    useUnfollowUserMutation();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.username === username) {
        setMyProfile(true);
      }
    }
  }, [username, userProfile]);

  useEffect(() => {
    setFollowing(alreadyFollow);
  }, [alreadyFollow]);

  const handleFollow = async () => {
    try {
      const res = await followUser(username).unwrap();
      setFollowing(true);
      // toast.success("")
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await unfollowUser(username).unwrap();
      setFollowing(false);
      // toast.success("")
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (infoLoading || postsLoading) return <Loader />;

  return (
    <div className="">
      <div className=" mx-auto w-[98%] md:w-[50%] min-h-screen lg:w-[30%] flex flex-col">
        <div className="bg-[#E1FF56] h-[180px] rounded-[2rem] flex items-center  justify-evenly">
          <img
            className="h-[120px] w-[120px] object-cover rounded-full shadow-md shadow-black "
            src={userProfile.dp}
            alt=""
          />

          <div className="flex flex-col gap-3 ">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-wider">
                {userProfile.username}
              </h1>

              <h3 className="font-[400]">{userProfile.bio}</h3>
            </div>

            <div>
              {myProfile ? (
                <Link to={`/${userProfile.username}/edit`}>
                  <button className="rounded-xl px-3 py-2 bg-[#277BC0] shadow-xl flex items-center gap-2">
                    <p className="text-white">Edit Profile</p>
                    <HiPencilSquare className="text-white text-xl" />
                  </button>
                </Link>
              ) : following ? (
                <button
                  className="rounded-xl px-3 py-2 bg-[#FF7F3F] shadow-xl flex items-center gap-2"
                  onClick={handleUnfollow}
                >
                  <p className="text-[#E3F6FF]">unfollow</p>
                  <MdCancel className="text-xl text-white" />
                </button>
              ) : (
                <button
                  className="rounded-xl px-3 py-2 bg-[#54B435] shadow-xl flex items-center gap-2"
                  onClick={handleFollow}
                >
                  <p className="text-white">follow</p>
                  <MdVerified className="text-xl text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#583CA1] backdrop-blur-lg shadow-sm shadow-gray-500 my-5 rounded-[1.5rem] py-5 ">
          <div className="w-[70%] mx-auto flex justify-between text-sm ">
            <p className="flex flex-col text-center text-white">
              <span className="font-[600]">{userPosts.length} &nbsp; </span>{" "}
              posts
            </p>
            <p className="flex flex-col text-center text-white">
              <span className="font-[600]">
                {userProfile.followers.length} &nbsp;{" "}
              </span>{" "}
              followers
            </p>
            <p className="flex flex-col text-center text-white">
              <span className="font-[600]">
                {userProfile.following.length - 1} &nbsp;{" "}
              </span>{" "}
              following
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-black/10 to-black/10 rounded-3xl py-5">
          {postsLoading && <Loader />}
          {userPosts.length === 0 ? (
            myProfile ? (
              <h1 className="text-white">
                You have not posted anything yet!
                <Link to="/create">
                  <h1 className="underline ani text-[#E1FF56] ">
                    Brap Up for the first time!
                  </h1>
                </Link>
              </h1>
            ) : (
              <h1 className="text-white">
                The user has not posted anything yet!
              </h1>
            )
          ) : (
            <div className="grid grid-cols-2 gap-5 w-[90%] mx-auto">
              {userPosts &&
                userPosts.map((post) => (
                  <Link key={post._id} to={`/posts/${post._id}`}>
                    <ProfilePosts key={post._id} imgURL={post.imgURL} />
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

import React from "react";
import Post from "../components/Post";
import { useGetAllPostsQuery } from "../slices/postApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
const HomeScreen = () => {
  const { data: posts, isLoading, refetch } = useGetAllPostsQuery();

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col gap-10">
        {posts && posts.length === 0 ? (
          <div className="flex min-h-[480px] justify-center items-center flex-col text-center">
            <h1 className="">There is nothing to show here!</h1>
            <Link to="/search">
              <h1 className="underline ani text-[#E1FF56] ">
                Please follow other users to see their posts
              </h1>
            </Link>
          </div>
        ) : (
          posts && posts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default HomeScreen;

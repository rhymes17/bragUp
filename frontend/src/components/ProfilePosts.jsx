import React from "react";

const ProfilePosts = ({ imgURL }) => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="aspect-w-1 aspect-h-1 max-h-[120px] md:max-h-[180px] rounded-xl overflow-hidden">
          <img className="object-cover w-full h-full" src={imgURL} alt="post" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;

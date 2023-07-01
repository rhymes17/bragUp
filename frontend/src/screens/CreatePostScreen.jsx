import React, { useState } from "react";
import { LiaUploadSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreatePostMutation } from "../slices/postApiSlice";
import Loader from "../components/Loader";

const CreatePostScreen = () => {
  const [caption, setCaption] = useState("");
  const [imgURL, setImgURL] = useState();
  const [imgLoading, setImgLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [createPost, { isLoading: postLoading }] = useCreatePostMutation();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dzg6u1lo");
    setImgLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlojlo14f/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImgURL(data.secure_url);

      toast.success("Image Uploaded Successfully!");
    } catch (error) {
      toast.error("Error uploading image:", error);
      return;
    }
    setImgLoading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await createPost({ imgURL, caption }).unwrap();

      toast.success("Post created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (imgLoading) {
    return <Loader />;
  }

  return (
    <div className="text-white h-screen">
      {imgURL ? (
        <form
          className="w-[95%] md:w-[50%] lg:w-[30%] mx-auto bg-[#98EECC] rounded-xl px-3 py-3 flex flex-col gap-3"
          onSubmit={submitHandler}
        >
          <div className="flex flex-col px-2 py-2 gap-2 text-white rounded-xl bg-gradient-to-r from-black/80 to-black/80 backdrop-blur-lg">
            <div className="px-3 py-3 flex gap-3 ">
              <img
                className="h-[45px] object-cover cover w-[45px] rounded-full shadow-sm"
                src={userInfo.dp}
                alt="profilePicture"
              />
              <input
                required
                type="text"
                defaultValue={caption}
                placeholder="Write a caption..."
                className="bg-transparent flex-1 w-[20%] bg-gradient-to-l from-[#98EECC]/70 to-[#98EECC]/70 backdrop-blur-lg rounded-md px-2 py-1 placeholder:text-white/80 focus:outline-none"
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
          {imgLoading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="w-[90%] mx-auto justify-center items-center flex mt-5 mb-3">
              <div className="image-container">
                <div className="box-shadow-container rounded-2xl aspect-w-1 aspect-h-1 max-h-[350px] md:max-h-[450px] overflow-hidden">
                  <img
                    className="rounded-2xl"
                    // ref={imageRef}
                    src={imgURL}
                    alt="Your Image"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button className="border border-transparent w-[30%] mx-auto bg-[#7B5DFB] py-2 px-2 rounded-lg text-white shadow-xl hover:bg-white/90 hover:text-[#7B5DFB] ani hover:border-white">
            Upload
          </button>
        </form>
      ) : (
        <div className="grid place-content-center  items-center h-[540px] justify-center">
          <input
            hidden
            type="file"
            id="imgInput"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="imgInput"
            className="px-2 py-2 border border-gray-500 shadow-sm shadow-gray-500 flex items-center gap-2 rounded-lg bg-[#583CA1] ani hover:bg-white/90 hover:text-[#583CA1] cursor-pointer"
          >
            <h3 className="font-[500]">Upload Image</h3>
            <LiaUploadSolid className="text-xl font-bold" />
          </label>
        </div>
      )}
    </div>
  );
};

export default CreatePostScreen;

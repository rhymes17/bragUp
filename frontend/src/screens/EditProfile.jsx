import React, { useEffect, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../slices/usersApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const { data: user, isLoading, refetch } = useGetUserQuery(userInfo.username);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username: currUse } = useParams();

  useEffect(() => {
    if (currUse !== userInfo.username) {
      navigate("/");
      toast.error("Cannot edit someone else's profile");
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      // setName(user.name);
      if (user) {
        setName(user.name);
      }
      setEmail(userInfo.email);
      setBio(userInfo.bio);
      setImgURL(userInfo.dp);
    }
  }, [userInfo, user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({
        username,
        imgURL,
        name,
        email,
        password,
        bio,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      refetch();
      navigate(`/${username}`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  if (updateLoading || isLoading) return <Loader />;
  return (
    <div className="">
      <form
        className=" mx-auto w-[98%] md:w-[50%] min-h-screen lg:w-[30%] flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="bg-[#E1FF56] h-[190px] rounded-[2rem] flex items-center py-5 gap-3 justify-evenly">
          <div className="flex flex-col justify-evenly items-center gap-3">
            {imgLoading ? (
              <Loader />
            ) : (
              <img
                className="h-[120px] w-[120px] object-cover rounded-full shadow-md shadow-black"
                src={imgURL}
                alt=""
              />
            )}

            <div className="flex flex-col gap-3">
              <div className="relative">
                <button className="rounded-xl px-3 py-2 bg-[#277BC0] shadow-xl flex items-center gap-2 cursor-pointer">
                  <p className="text-white">Add Image</p>
                  <BsFillCameraFill className="text-white text-xl" />
                </button>
                <input
                  type="file"
                  className="absolute top-0 text-sm w-[100%] h-[100%] opacity-0 cursor-pointer"
                  accept="image/*"
                  //   value={imgURL}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col gap-1 ">
            <h2 className="text-lg">username</h2>
            <input
              type="text"
              className="py-2 px-2 text-white bg-gradient-to-r from-black/20 to-black/20 bg-transparent backdrop-blur-md rounded-lg placeholder:text-white/90 focus:outline-none placeholder:font-[300]"
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div> */}
        </div>

        <div className="bg-[#583CA1] backdrop-blur-lg shadow-sm shadow-gray-500 my-5 rounded-[1.5rem] py-5 ">
          <div className="w-[70%] mx-auto flex flex-col justify-between text-sm text-white gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg">bio</h2>
              <input
                type="text"
                required
                maxLength="15"
                className="py-2 px-2 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg placeholder:text-white/90 focus:outline-none placeholder:font-[300]"
                placeholder="Enter your bio"
                // value={bio}
                defaultValue={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <h2 className="text-lg">username</h2>
              <input
                required
                disabled
                type="text"
                className="py-2 px-2 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg border boreder-transparent placeholder:text-white/90 focus:outline-none placeholder:font-[300] disabled:border-red-500"
                placeholder="Choose username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <h2 className="text-lg">name</h2>
              <input
                required
                type="text"
                className="py-2 px-2 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg placeholder:text-white/90 focus:outline-none placeholder:font-[300]"
                placeholder="Enter Your Name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <h2 className="text-lg">email</h2>
              <input
                required
                type="email"
                className="py-2 px-2 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg placeholder:text-white/90 focus:outline-none placeholder:font-[300] invalid:border-pink-500"
                placeholder="Enter Your Email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <h2 className="text-lg">password</h2>
              <input
                type="password"
                className="py-2 px-2 bg-gradient-to-r from-white/20 to-white/20 bg-transparent backdrop-blur-md rounded-lg placeholder:text-white/90 focus:outline-none placeholder:font-[300] invalid:border-pink-500"
                placeholder="Choose Your Password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="my-3 border  w-[30%] px-2 py-2 rounded-md mx-auto text-[#583CA1] ani border-[#583CA1] font-bold bg-white hover:bg-transparent hover:text-white hover:border-white"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ball1 from "../assets/images/ball1.png";
import ball3 from "../assets/images/ball3.png";
import ball2 from "../assets/images/ball2.png";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }, error] = useLoginUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        username,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      return;
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-black/95 min-h-screen flex flex-col ">
      <Link to="/">
        <h1 className="text-center font-signature text-white mt-[3%] md:p-0 p-[5%] text-4xl underline">
          BragUp
        </h1>
      </Link>
      <div className="flex justify-center items-center relative overflow-hidden flex-1">
        {/* <div className="h-[120px] w-[300px] absolute top-[30%] left-[33.6%]   bg-gradient-to-r from-[#FD5E00] to-[#F96A1B]"></div> */}
        <div className="h-[580px] w-[300px] flex justify-center items-center bg-gradient-to-t from-white/5 to-white/10 rounded-xl backdrop-blur-[8px] md:backdrop-blur-[30px] font-reg z-10">
          <div className=" w-full px-7 text-white flex flex-col gap-7">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl ">Login</h1>
              <p className="text-[0.7rem] font-[200] text-white-300">
                Welcome back! Please login to your account.
              </p>
            </div>
            {/* Inputs */}
            <form className="flex flex-col gap-5" onSubmit={submitHandler}>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={username}
                  className="bg-transparent border border-white px-2 py-2 text-sm rounded-md focus:outline-none placeholder:text-sm placeholder:text-gray-400 "
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  className="bg-transparent border  border-white px-2 py-2 text-sm rounded-md focus:outline-none placeholder:text-sm placeholder:text-gray-400 "
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              {/* buttons */}
              <div className="text-center flex flex-col gap-2">
                <button className="bg-gradient-to-r from-[#671D92] to-[#f45b02] w-full py-2 rounded-lg font-[300] hover:bg-gradient-to-l from">
                  Login
                </button>
                <p className="text-sm font-[300] text-white/95">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span className="text-cyan-500 underline ani hover:text-white">
                      Register
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <img
          className="h-[180px] md:h-[280px] lg:h-[220px] absolute bottom-2 right-[-20%] sm:right-[15%] md:bottom-0 lg:right-[30%] md:right-[10%] brightness-75"
          src={ball1}
          alt="ball1"
        />
        <img
          className="h-[220px] md:h-[280px] absolute top-[1%] left-[-20%] sm:left-[10%] md:top-[5%] lg:left-[30%] lg:top-[12%] md:left-[10%] brightness-75"
          src={ball2}
          alt="ball1"
        />
        <img
          className=" md:visible h-[120px] absolute bottom-0 md:bottom-[15%] md:left-[20%] lg:left-[30%] left-[0%] brightness-75"
          src={ball3}
          alt="ball1"
        />
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Login;

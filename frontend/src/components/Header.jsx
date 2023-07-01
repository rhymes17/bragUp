import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ball from "../assets/images/ball3.png";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    if (!userInfo) {
      navigate("/login");
    }

    try {
      const res = await logoutUser().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="font-reg sticky top-0 text-white border-b border-white/30 bg-gradient-to-l from-white/5 to-white/5 z-30 backdrop-blur-lg  ">
      <div className="py-5 pb-4 px-5 flex items-center justify-between lg:w-[70%] mx-auto">
        <Link to="/">
          <h1 className=" font-signature text-4xl underline">BragUp</h1>
        </Link>
        {userInfo ? (
          <div className="flex gap-5">
            <button
              className="border border-white/80 md:text-base text-sm py-2 px-3  rounded-[3px] ani hover:bg-white/90 hover:border-black hover:text-black"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-5">
            <Link to="/register">
              <button className="border collapse md:visible  border-white/80 md:text-base text-sm py-2 px-3  rounded-[3px] ani hover:bg-white/90 hover:border-black hover:text-black">
                Register
              </button>
            </Link>
            <Link to="login">
              <button className="border border-white/80 md:text-base text-sm py-2 px-3  rounded-[3px] ani hover:bg-white/90 hover:border-black hover:text-black">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

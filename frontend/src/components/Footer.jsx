import { useEffect, useState } from "react";
import {
  AiFillHome,
  AiFillHeart,
  AiOutlineHome,
  AiOutlineHeart,
} from "react-icons/ai";
import { BsSearch, BsPersonCircle, BsSearchHeart } from "react-icons/bs";
import { BiSolidSearch } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { MdAddCircleOutline, MdAddCircle } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const location = useLocation();
  const [route, setRoute] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      const isKeyboardOpen =
        window.innerHeight < document.documentElement.clientHeight;
      setIsVisible(!isKeyboardOpen);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className=" h-[55px] w-[70%] mx-auto sticky bottom-5 rounded-2xl bg-gradient-to-t from-white/5 to-white/10 backdrop-blur-[5px] z-30 md:w-[30%] lg:w-[20%]">
          <div className="bg-transparent h-full w-[90%] flex items-center justify-center gap-5 mx-auto">
            {route === "/" ? (
              <AiFillHome className="text-white text-4xl bg-transparent p-1 cursor-pointer  rounded" />
            ) : (
              <Link to="/">
                <AiOutlineHome className="text-white text-4xl bg-transparent p-1 cursor-pointer rounded" />
              </Link>
            )}
            {route === "/create" ? (
              <MdAddCircle className="text-white text-[45px] bg-transparent p-2 cursor-pointer rounded" />
            ) : (
              <Link to="/create">
                <MdAddCircleOutline className="text-white text-[45px] bg-transparent p-2 cursor-pointer rounded" />
              </Link>
            )}

            {route === "/search" ? (
              <BsSearchHeart className="text-white text-[32px] bg-transparent p-1 cursor-pointer rounded" />
            ) : (
              <Link to="/search">
                <BsSearch className="text-white text-3xl bg-transparent p-1 cursor-pointer rounded" />
              </Link>
            )}

            {userInfo && route === `/${userInfo.username}` ? (
              <BsPersonCircle className="text-white text-[33px] bg-transparent p-1  rounded" />
            ) : (
              <Link to={`${userInfo.username}`}>
                <RxAvatar className="text-white text-4xl bg-transparent p-1  rounded" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;

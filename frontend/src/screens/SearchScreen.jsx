import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import { useSearchUserQuery } from "../slices/usersApiSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const SearchScreen = () => {
  const [userText, setUserText] = useState();
  const [results, setResults] = useState({});

  const { data, isLoading: userLoading } = useSearchUserQuery(userText);

  return (
    <div>
      <div className=" mx-auto w-[98%] md:w-[50%] min-h-screen lg:w-[30%] flex flex-col">
        <div className="bg-[#A4F264] py-2 rounded-lg flex - flex-col gap-2 px-3">
          <h3 className="font-[600]  tracking-wider">Search User</h3>
          <div className="mb-1 flex bg-gradient-to-l from-white/60 to-white/60 backdrop-blur-lg rounded-md items-center px-2">
            <input
              type="text"
              defaultValue={userText}
              placeholder="Enter username or name to search.."
              className="bg-transparent flex-1  px-2 py-1 placeholder:text-black/60 focus:outline-none"
              onChange={(e) => setUserText(e.target.value)}
            />
            {/* <button type="submit">
              <HiSearch className="text-xl" />
            </button> */}
          </div>
        </div>

        {userLoading ? (
          <Loader />
        ) : (
          data.map((curr) => (
            <Link key={curr._id} to={`/${curr.username}`}>
              <div
                key={curr._id}
                className="mt-2 bg-[#583CA1] h-[80px] rounded-xl flex gap-3 items-center px-3"
              >
                <img
                  className="h-[65px] object-cover cover w-[65px] rounded-full shadow-sm"
                  src={curr.dp}
                  alt="profilePicture"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white font-[500] tracking-wider">
                    {curr.username}
                  </p>
                  <p className="text-white/50">{curr.name}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchScreen;

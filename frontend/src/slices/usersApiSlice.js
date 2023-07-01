import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Register User
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),

    //Login user
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    //logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    //Get a single user
    getUser: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/${username}`,
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5,
    }),

    //update the user info
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.username}/edit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    //Follow a user
    followUser: builder.mutation({
      query: (username) => ({
        url: `${USERS_URL}/${username}/follow`,
        method: "PUT",
      }),
      invalidatesTags: ["Users"],
    }),

    //Unfollow an user
    unfollowUser: builder.mutation({
      query: (username) => ({
        url: `${USERS_URL}/${username}/unfollow`,
        method: "PUT",
      }),
      invalidatesTags: ["Users"],
    }),

    //alreadyFollowing
    alreadyFollow: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/${username}/alreadyFollowing`,
      }),
      invalidatesTags: ["Users"],
    }),

    //Search User
    searchUser: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/user/search?query=${username}`,
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useAlreadyFollowQuery,
  useSearchUserQuery,
} = usersApiSlice;

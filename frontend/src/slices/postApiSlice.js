import { POSTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Create post
    createPost: builder.mutation({
      query: (data) => ({
        url: POSTS_URL,
        method: "POST",
        body: data,
      }),
    }),

    //Get My Posts
    getMyPosts: builder.query({
      query: (username) => ({
        url: `${POSTS_URL}/${username}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Posts"],
    }),

    //Get all posts
    getAllPosts: builder.query({
      query: () => ({
        url: POSTS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Posts"],
    }),

    //Get a post
    getPost: builder.query({
      query: (postId) => ({
        url: `${POSTS_URL}/getPost/${postId}`,
      }),
      providesTags: ["Posts"],
    }),

    //Like a post
    likePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Posts"],
    }),

    //Unlike a post
    unlikePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}/unlike`,
        method: "PUT",
      }),
      invalidatesTags: ["Posts"],
    }),

    //Check if already liked
    alreadyLiked: builder.query({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}/alreadyLiked`,
      }),
      providesTags: ["Posts"],
    }),

    //Create a new comment
    postComment: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}/comment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    //Delete a post
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/getPost/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetMyPostsQuery,
  useGetAllPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useAlreadyLikedQuery,
  useGetPostQuery,
  usePostCommentMutation,
  useDeletePostMutation,
} = postApiSlice;

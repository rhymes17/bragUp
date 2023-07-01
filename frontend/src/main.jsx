import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Register from "./screens/Register.jsx";
import Login from "./screens/Login.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import EditProfile from "./screens/EditProfile.jsx";
import CreatePostScreen from "./screens/CreatePostScreen.jsx";
import { Provider } from "react-redux";
import store from "./store.js";
import { CloudinaryContext, Image } from "cloudinary-react";
import UploadImage from "./screens/Testing.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PostScreen from "./screens/PostScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/create" element={<CreatePostScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/:username" element={<ProfileScreen />} />
          <Route path="/:username/edit" element={<EditProfile />} />
          <Route path="/test" element={<UploadImage />} />
          <Route path="/posts/:postId" element={<PostScreen />} />
        </Route>
      </Route>
    </>
  )
);

const cloud = "dzg6u1lo";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CloudinaryContext cloudName={cloud}>
        <RouterProvider router={router} />
      </CloudinaryContext>
    </Provider>
  </React.StrictMode>
);

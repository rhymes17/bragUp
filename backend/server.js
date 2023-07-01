import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/connect.js";
import path from "path";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

connectDB();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/dist")));

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// app.use(notFound);
app.use(errorHandler);
// Handle other routes or API endpoints here

// Serve the index.html file for all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

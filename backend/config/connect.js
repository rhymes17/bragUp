import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(conn.connection.host.cyan.underline);
  } catch (error) {
    console.log(
      `Failed to connect to Database : ${error.message}`.red.underline.bold
    );
    process.exit(1);
  }
};

export default connectDB;

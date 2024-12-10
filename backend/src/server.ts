import mongoose from "mongoose";
import app from "./app";
require('dotenv').config();

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (err: unknown) {
    console.error("MongoDB connection error:", (err as Error).message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err: unknown) => {
  console.error("MongoDB error:", (err as Error).message);
  process.exit(1);
});

connectDB();

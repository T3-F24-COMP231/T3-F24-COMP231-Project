import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 4000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
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

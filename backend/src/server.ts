import mongoose from "mongoose";
import app from "./app";
import config from "./config/config";

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected successfully");

    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
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

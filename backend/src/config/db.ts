import mongoose from "mongoose";
import config from "./config";
import app from "../app";

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(config.port, () => {
      console.log(
        `App is connected to the database & running on port ${config.port}!`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
  process.exit(1);
});

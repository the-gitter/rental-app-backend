import "dotenv/config";
import * as dotenv from "dotenv";

import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "rental_app",
  });

  mongoose.connection.on("connected", () => {
    console.log("mongoose connected  🚀");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("mongoose is disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default  connectDB;

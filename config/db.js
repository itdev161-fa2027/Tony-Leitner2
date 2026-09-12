import mongoose from "mongoose";
import config from "config";

const db = config.get("mongoURI");

const connectDatabase = async () => {
	const connection = await mongoose.connect(db);
	console.log("MongoDB connection established successfully.");
	return connection;
};

export default connectDatabase;

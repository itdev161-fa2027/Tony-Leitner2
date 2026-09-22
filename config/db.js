import mongoose from "mongoose";
import config from "config";
import dotenv from "dotenv";

dotenv.config();

const db = process.env.MONGO_URI || config.get("mongoURI");

const connectDatabase = async () => {
	try {
		const connection = await mongoose.connect(db);
		console.log("Connected to MongoDB");
		return connection;
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

export default connectDatabase;

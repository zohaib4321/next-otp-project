import mongoose from "mongoose";

const dbName = "ama-app";

interface ConnectionObject {
	isConnected?: number;
}

const connction: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
	if (connction.isConnected) {
		console.log("Already connected to the database");
		return;
	}

	try {
		const db = await mongoose.connect(
			`${process.env.MONGODB_URI}/${dbName}`
		);

		connction.isConnected = db.connections[0].readyState;
		console.log("🍀 MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection failed");
		process.exit(1);
	}
};

export default dbConnect
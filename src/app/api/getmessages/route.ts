import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const _user = session?.user;

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "Not authorized",
			},
			{ status: 401 }
		);
	}

	const userId = new mongoose.Types.ObjectId(_user?._id);

	try {
		const user = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);
		console.log(user);

		if (!user || user.length === 0) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				messages: user[0].messages,
			},
			{ status: 200 }
		);
	} catch (error) {
    console.error("An unexpected error occured");
    
    return Response.json(
			{
				success: false,
				message: "An unexpected error occured",
			},
			{ status: 500 }
		);
  }
}

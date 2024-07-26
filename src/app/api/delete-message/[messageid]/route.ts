import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(
	request: Request,
	{ params }: { params: { messageid: string } }
) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "Unauthorized request",
			},
			{ status: 401 }
		);
	}

	const userId = user?.id;
	try {
		const updatedResult = await UserModel.updateOne(
			{ _id: userId },
			{
				$pull: {
					messages: { _id: params.messageid },
				},
			}
		);

		if (updatedResult.modifiedCount === 0) {
			return Response.json(
				{
					success: false,
					message: "Message not found or already deleted",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Message deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Failed to delete message",
			},
			{ status: 500 }
		);
	}
}

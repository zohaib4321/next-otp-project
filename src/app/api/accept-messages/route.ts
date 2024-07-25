import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated"
      },
      {status: 401}
    )
  }

  const userId = user?._id

  const {acceptMessages} = await request.json()
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages
      },
      {
        new: true
      }
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        {status: 404}
      )
    }

    return Response.json(
      {
        success: true,
        message: "Update user message acceptance status successfully",
        updatedUser
      },
      {status: 200}
    )
  } catch (error) {
    console.error("Error updating message acceptance status");
    return Response.json(
      {
        success: false,
        message: "User not authenticated"
      },
      {status: 500}
    )
  }


}

export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated"
      },
      {status: 401}
    )
  }

  const userId = user?._id

  try {
    const foundedUser = await UserModel.findById(userId)

    if (!foundedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        {status: 404}
      )
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundedUser.isAcceptingMessage 
      },
      {status: 200}
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to retrieve message acceptance status"
      },
      {status: 500}
    )
  }
}

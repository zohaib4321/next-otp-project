import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const {username, code} = await request.json()
    
    const user = await UserModel.findOne({
      username,
      isVerified: false
    })

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      }, {
        status: 404
      })
    }

    const isCodeCorrect = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeCorrect && isCodeNotExpired) {
      user.isVerified = true
      await user.save()
      return Response.json({
        success: true,
        message: "Account verified successfully"
      }, {
        status: 200
      })
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Verify code is expired. Please signup again to get code"
      }, {
        status: 400
      })
    } else {
      return Response.json({
        success: false,
        message: "Incorrect verification code"
      }, {
        status: 400
      })
    }
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to verify code"
    }, {
      status: 500
    })
  }
}
import { Resend } from 'resend';
import {ApiResponse} from "@/types/ApiResponse"
import VerificationEmail from "../../emails/VerificationEmail"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystry Message | Verification Code',
      react: VerificationEmail({username, otp: verifyCode}),
    });
    return {
      success: true, 
      message: "Verification email sent"
    }
  } catch (emailError) {
    console.error("Failed to sent verification email", emailError);
    return {
      success: false, 
      message: "Failed to sent verification email "
    }
  }
}
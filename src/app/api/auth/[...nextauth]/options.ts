import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ username: credentials.identifier },
							{ email: credentials.identifier },
						],
					});

					if (!user) {
						throw new Error("No user found with this email or username");
					}

					if (!user.isVerified) {
						throw new Error("Verify your account before signin");
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordCorrect) {
						throw new Error("Incorrect password");
					}

					return user;
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.username = user.username
        token.isVerified = user.isVerified
        token.isAcceptingMessage = user.isAcceptingMessage
      }
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id
				session.user.username = token.username
				session.user.isVerified = token.isVerified
				session.user.isAcceptingMessage = token.isAcceptingMessage
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXT_AUTH_SECRET,
	pages: {
		signIn: "/signin",
	},
};

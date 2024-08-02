"use client";

import { signInSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
	const [isProcesing, setIsProcessing] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsProcessing(true);
		const result = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
		});

		if (result?.error) {
			if (result.error === "CredentialsSignin") {
				toast({
					title: "Login failed",
					description: "Incorrect username or password",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
		}

		if (result?.url) {
			router.replace("/dashboard");
		}

		setIsProcessing(false);
	};

	return (
		<div className="grid lg:grid-cols-12 md:grid-cols-12 h-screen">
			<div className="flex w-full justify-center lg:col-span-4 md:col-span-5">
				<Card className="md:w-full sm:w-2xl w-full pt-7">
					<CardHeader>
						<CardTitle className="font-light mb-5 text-2xl">Feedback</CardTitle>
						<CardDescription className="lg:text-2xl text-xl font-medium text-white">
							Log in to your account
						</CardDescription>

						<h1 className="md:text-lg font-medium text-white pt-2">
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="text-md font-semibold text-white hover:underline"
							>
								Sign up
							</Link>
						</h1>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								{/* email */}
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="Enter your email..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Password */}
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your password..."
													{...field}
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full rounded-full"
									variant="default"
								>
									{
										isProcesing ? (
											<div className="flex items-center justify-between">
												<Loader2 className="mr-2 animate-spin" /> <span>Please wait</span> 
											</div>
										) : 'Log in'
									}
									
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
			<div className="h-full w-full bg-gray-200 hidden lg:col-span-8 md:col-span-7 md:block">
				<img
					className="mx-auto h-full w-full rounded-md object-cover"
					src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
					alt=""
				/>
			</div>
		</div>
	);
}

"use client";

import { signUpSchema } from "@/schemas";
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
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmiting, setIsSubmiting] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	const debounced = useDebounceCallback(setUsername, 500);

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					const response = await axios.get<ApiResponse>(
						`/api/check-unique-username?username=${username}`
					);
					
					setUsernameMessage(response.data?.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError?.response?.data?.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmiting(true);
		try {
			const response = await axios.post<ApiResponse>("/api/signup", data);
			toast({
				title: "Success",
				description: response?.data.message,
			});

			router.replace(`/verify/${username}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage =
				axiosError?.response?.data?.message ??
				"There was a problem with your signup. Please try again";
			toast({
				title: "Sign up failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmiting(false);
		}
	};

	return (
		<section>
			<div className="grid md:grid-cols-12 h-screen">
				<div className="flex w-full items-center justify-center bg-slate-400 md:col-span-4">
					<div className="w-full sm:w-96 bg-slate-100">
						<h1>MESSAGEAPP</h1>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your username..."
												{...field}
												onChange={(e) => {
													field.onChange(e);
													debounced(e.target.value);
												}}
											/>
										</FormControl>
										{!isCheckingUsername && usernameMessage && (
											<p
												className={`text-sm ${
													usernameMessage === "Username is available"
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{usernameMessage}
											</p>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
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
							<Button type="submit" variant="outline">Sign up</Button>
						</form>
					</Form>
					</div>
				</div>
				<div className="h-full w-full bg-gray-200 hidden md:col-span-8 md:block">
					<img
						className="mx-auto h-full w-full rounded-md object-cover"
						src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
						alt=""
					/>
				</div>
			</div>
		</section>
	);
}

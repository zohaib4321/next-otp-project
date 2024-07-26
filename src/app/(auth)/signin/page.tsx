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

import { signIn } from "next-auth/react";

export default function SignInPage() {
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
	};
	return (
		<div className="grid md:grid-cols-12 h-screen">
			<div className="flex w-full items-center justify-center bg-slate-400 md:col-span-4">
				<div className="w-full sm:w-96 bg-slate-100">
					<h1>MESSAGEAPP</h1>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
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
							<Button type="submit" variant="outline">
								Sign in
							</Button>
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
	);
}

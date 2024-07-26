"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyCodeSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { toast } from "@/components/ui/use-toast";

export default function OTPVerifyPage() {
	const params = useParams<{ username: string }>();
	const router = useRouter();

	const form = useForm<z.infer<typeof verifyCodeSchema>>({
		resolver: zodResolver(verifyCodeSchema),
	});

	const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
		try {
			const response = await axios.post<ApiResponse>("/api/verifycode", {
				username: params.username,
				code: data.code,
			});

			toast({
				title: "Success",
				description: response.data.message,
			});

			router.replace("/signin");
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message;
			toast({
				title: "Verification failed",
				description: errorMessage ?? "An error accured. Please try again",
				variant: "destructive",
			});
		}
	};
	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Verification code</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your verification code..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant="outline">
						Verify
					</Button>
				</form>
			</Form>
		</div>
	);
}

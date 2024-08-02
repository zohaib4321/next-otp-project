"use client";

import { useCallback, useEffect, useState } from "react";
import MessageCard from "@/components/messagecard";
import Navbar from "@/components/navbar";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { messageAcceptanceStatus } from "@/schemas/index";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy } from 'lucide-react';

export default function Dashboard() {
	const { data: session } = useSession();

	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const [isCopied, setIsCopied] = useState(false)

	const { toast } = useToast();

	const form = useForm<z.infer<typeof messageAcceptanceStatus>>({
		resolver: zodResolver(messageAcceptanceStatus),
	});

	const { register, watch, setValue } = form;

	const acceptMessages = watch("acceptMessages");

	const handleMessageDelete = (messageId: string) => {
		setMessages(messages.filter((message) => message._id !== messageId));
	};

	const fetchMessageAcceptanceStatus = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>(`/api/accept-messages`);
			setValue("acceptMessages", response.data.isAcceptingMessage!);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to fetch message acceptance status",
				variant: "destructive",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue]);

	const fetchMessages = useCallback(async () => {
		setIsLoading(true);
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>(`/api/getmessages`);
			setMessages(response.data.messages || []);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			if (axiosError.response?.data.message === "User not found") {
				toast({
					title: "Success",
					description: "No messages yet",
				});
				return;
			}
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ?? "Failed to fetch messages",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setIsSwitchLoading(false);
		}
	}, [setIsLoading, setMessages]);

	useEffect(() => {
		if (!session || !session.user) return;
		fetchMessages();
		fetchMessageAcceptanceStatus();
	}, [session, setValue, fetchMessageAcceptanceStatus, fetchMessages]);

	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
				acceptMessages: !acceptMessages,
			});
			setValue("acceptMessages", !acceptMessages);
			toast({
				title: response.data.message,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to update message settings",
				variant: "destructive",
			});
		}
	};

	if (!session || !session.user) {
		return <div></div>;
	}

	const user = session?.user as User;
	const username = user.username;

	const baseURL = `${window.location.protocol}//${window.location.host}`;
	const profilePath = `${baseURL}/user/${username}`;

	const copyToClipboard = () => {
		window.navigator.clipboard.writeText(profilePath);
		setIsCopied(true)
		setTimeout(() => {
			setIsCopied(false)
		}, 1000);
	};

	return (
		<div>
			<Navbar />
			<div className="container px-14">
				<h1 className="text-xl font-bold my-6">User dashboard</h1>
				<div className="flex items-center mb-6">
					<Input
					disabled
					value={profilePath}
					/>
					<Button
					onClick={copyToClipboard}
					>
						{
							!isCopied ? 
							<Copy className="w-5 h-5" /> :
							<Check className="w-5 h-5 text-green-500" />
						}
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<Switch
						{...register("acceptMessages")}
						checked={acceptMessages}
						onCheckedChange={handleSwitchChange}
						disabled={isSwitchLoading}
					/>
					<Label>Accepting Messages: {acceptMessages ? "On" : "Off"}</Label>
				</div>
				<div className="grid md:grid-cols-2 mt-6 gap-6">
					{messages.length > 0 ? (
						messages.map((message) => (
							<MessageCard
								key={message._id}
								message={message}
								onMessageDelete={handleMessageDelete}
							/>
						))
					) : (
						<p className="font-semibold">No messages yet</p>
					)}
				</div>
			</div>
		</div>
	);
}

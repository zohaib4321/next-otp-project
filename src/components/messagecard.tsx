"use client";

import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React from "react";
import { useToast } from "./ui/use-toast";
import dayjs from "dayjs"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react";

type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId: string) => void;
};

export default function MessageCard() {
	// const { toast } = useToast();

	// const handleDeleteConfirm = async () => {
	// 	try {
	// 		const response = await axios.delete<ApiResponse>(
	// 			`/api/delete-message/${message._id}`
	// 		);
	// 		toast({
	// 			title: response.data.message,
	// 		});
	// 		onMessageDelete(message._id);
	// 	} catch (error) {
	// 		const axiosError = error as AxiosError<ApiResponse>;
	// 		toast({
	// 			description:
	// 				axiosError.response?.data.message ?? "Failed to delete message",
	// 		});
	// 	}
	// };

	return (
		<Card>
			<CardHeader>
			</CardHeader>
      <div>
			<CardContent className="flex items-center justify-between">
				<CardTitle>How are you?</CardTitle>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
          <X className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardContent>
      <CardFooter className="text-sm font-medium">
        {
          dayjs('2024-07-27T07:48:10.971+00:00').format('MMM DD, YYYY HH:mm A')
        }
      </CardFooter>
      </div>
		</Card>
	);
}

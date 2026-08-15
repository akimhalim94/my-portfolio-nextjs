"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

//send data from contact me form to db
export async function sendMessageAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in the form." };
  }

  try {
    await prisma.message.create({
      data: { name, email, message },
    });

    return {
      success: true,
      message: "You message has been sent!",
    };
  } catch (error) {
    console.error("Failed to send:", error);
    return { success: false, error: "Server error. Please try again." };
  }
}

//get message from db
export async function getMessages() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, messages };
  } catch (error) {
    console.error("Failed to load messages:", error);
    return { success: false, error: "Failed to load messages." };
  }
}

//delete message from db
export async function deleteMessageAction(id: string) {
  try {
    await prisma.message.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
}

import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReceverSocketId, io } from "../webSocket/socket.js";

export const sendMessage = async (request, response) => {
    try {
        const { message } = request.body;
        const { id: reciverId } = request.params;
        const senderId = request.findUser._id;

        if (!message?.trim() && !request.file) {
            return response.status(400).send({
                success: false,
                message: "Message text or a file is required"
            });
        }

        let chats = await Conversation.findOne({
            participents: { $all: [senderId, reciverId] }
        });

        if (!chats) {
            chats = await Conversation.create({
                participents: [senderId, reciverId]
            });
        }

        let media = { url: "", type: "", fileName: "" };

        if (request.file) {
            const mimetype = request.file.mimetype;
            let type = "document";
            if (mimetype.startsWith("image/")) type = "image";
            else if (mimetype.startsWith("video/")) type = "video";

            media = {
                url: `/uploads/${request.file.filename}`,
                type,
                fileName: request.file.originalname
            };
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message: message || "",
            media,
            ConversationId: chats._id
        });

        chats.messages.push(newMessage._id);

        await Promise.all([chats.save(), newMessage.save()]);

        const reciverSocketId = getReceverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }

        return response.status(200).send(newMessage);

    } catch (error) {
        console.log("Send message error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong while sending the message"
        });
    }
};

export const getMessages = async (request, response) => {
    try {
        const { id: reciverId } = request.params;
        const senderId = request.findUser._id;

        const chats = await Conversation.findOne({
            participents: { $all: [senderId, reciverId] }
        }).populate("messages");

        if (!chats) {
            return response.status(200).send([]);
        }

        return response.status(200).send(chats.messages);

    } catch (error) {
        console.log("Get messages error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong while getting the messages"
        });
    }
};
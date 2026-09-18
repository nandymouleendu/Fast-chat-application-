import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReceverSocketId, io } from "../webSocket/socket.js";

export const sendMessage = async (request, response) => {
    try {
        const { message } = request.body;//Pulls the text message from the request body
        const { id: reciverId } = request.params;//pulls reciverid url
        const senderId = request.findUser._id;//Pulls the sender's ID from request.findUser

        if (!message?.trim() && !request.file) {//Validates that the message isn't completely empty — either there must be actual text (after trimming whitespace) or an uploaded file
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

        let media = { url: "", type: "", fileName: "" };//for text-only messages, this stays empty

        if (request.file) {
            const mimetype = request.file.mimetype;//If a file was uploaded, inspects its browser-reported MIME type like img,mp4 etc
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

        await Promise.all([chats.save(), newMessage.save()]);//i think its not working for re appearing and disappearing msges well see later

        const reciverSocketId = getReceverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);//it sends the new message only to that one specific connection — not broadcast to everyone — achieving real-time delivery. If the receiver is offline, this simply does nothing
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
        }).populate("messages");//tells Mongoose to automatically fetch the full Message documents matching those IDs and substitute them in, so chats.messages becomes an array of complete message objects, not just ID strings.

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
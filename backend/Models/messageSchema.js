import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    media: {
        url: { type: String, default: "" },
        type: { type: String, enum: ["image", "video", "document", ""], default: "" },
        fileName: { type: String, default: "" }
    },
    ConversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
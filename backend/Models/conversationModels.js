import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    participents:[
        {//participents two id is stored in cluster
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
],
    messages:[
        {
        type:mongoose.Schema.Types.ObjectId,//these store msg ids in mongodb but not the actual msg
        ref:"Message",
        default: []//if no msg is there
        }
    ]

},{timestamps:true})

const Conversation = mongoose.model('Conversation',conversationSchema)

export default Conversation;
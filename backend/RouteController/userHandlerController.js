import User from "../Models/userModels.js";
import Conversation from "../Models/conversationModels.js";

export const getUserBySearch = async (request, response) => {
    try {
        const currentUserId = request.findUser._id;
        const search = request.query.search || "";

        const user = await User.find({
            $and: [
                {
                    $or: [
                        { Username: { $regex: '.*' + search + '.*', $options: 'i' } },
                        { Fullname: { $regex: '.*' + search + '.*', $options: 'i' } },
                    ]
                },
                {
                    _id: { $ne: currentUserId }
                }
            ]
        }).select("-Password").select("-Email");

        return response.status(200).send(user);

    } catch (error) {
        console.log("Get user by search error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong while searching users"
        });
    }
};

export const getCorrentChatters = async (request, response) => {
    try {
        const currentUserId = request.findUser._id;

        const currenTchatters = await Conversation.find({
            participents: currentUserId
        }).sort({ updatedAt: -1 });

        if (!currenTchatters || currenTchatters.length === 0) {
            return response.status(200).send([]);
        }

        const participentIDS = currenTchatters.reduce((ids, conversation) => {
            return [...ids, ...conversation.participents];
        }, []);

        const otherParticipentIDS = participentIDS.filter(
            id => id.toString() !== currentUserId.toString()
        );

        const user = await User.find({ _id: { $in: otherParticipentIDS } }).select("-Password").select("-Email");

        const users = otherParticipentIDS
            .map(id => user.find(u => u._id.toString() === id.toString()))
            .filter(Boolean);

        return response.status(200).send(users);

    } catch (error) {
        console.log("Get current chatters error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong while searching for users chats"
        });
    }
};

export const getAllUsers = async (request, response) => {
    try {
        const currentUserId = request.findUser._id;

        const users = await User.find({ _id: { $ne: currentUserId } })
            .select("-Password")
            .select("-Email");

        return response.status(200).send(users);

    } catch (error) {
        console.log("Get all users error:", error.message);
        return response.status(500).send({
            success: false,
            message: "Something went wrong while fetching users"
        });
    }
};




// // import { response } from "express";
// import User from "../Models/userModels.js";
// import Conversation from "../Models/conversationModels.js";

// export const getUserBySearch = async (request, response) => {
//     try {
//         const currentUserId = request.findUser._id;
//         const search = request.query.search || ""; 
//         const user = await User.find({
//                 $and:[
//                     {
//                         $or:[
//                             {Username:{$regex:'.*'+search+'.*',$options:'i'}},
//                             {Fullname:{$regex:'.*'+search+'.*',$options:'i'}},
//                         ]
//                     },
//                     {
//                         _id: { $ne: currentUserId }
//                     }
//                 ]
//         }).select("-Password").select("-Email");

//         return response.status(200).send(user);

//         // const filter = {
//         //     _id: { $ne: currentUserId }
//         // };

//         // if (search) {
//         //     filter.Username = { $regex: search, $options: "i" };
//         // }

//         // const users = await user.find(filter).select("-Password");

//         // return response.status(200).send(users);

//     } catch (error) {
//         console.log("Get user by search error:", error.message);
//         return response.status(500).send({
//             success: false,
//             message: "Something went wrong while searching users"
//         });
//     }
// };

// export const getCorrentChatters = async(request,response) =>{
//     try {
//         const currentUserId = request.findUser._id;
//         const currenTchatters = await Conversation.find({
//             participents:currentUserId
//         }).sort({updatedAt :-1});

//         if (!currenTchatters || currenTchatters.length === 0) {
//            return response.status(200).send([]);
//         }
//         const participentIDS = currenTchatters.reduce((ids,conversation) =>{
//         const otherParticipentIDS = participentIDS.filter(id => id.toString() !== currentUserId.toString());        
//             return[...ids,...otherParticipentIDS]
//         })
//             const otherParticipentIDS = participentIDS.filter(id => id.toString() !== currentUserId.toString());

//             const user = await User.find({_id:{$in:otherParticipentIDS}}).select("-Password").select("Email");

//             const users = otherParticipentIDS.map(id => user.find(u => u._id.toString() === id.toString()) );

//           return response.status(200).send(users);

//     } catch (error) {
//         console.log("Get user by search error:", error.message);
//         return response.status(500).send({
//         success: false,
//         message: "Something went wrong while searching for users chats"
//         });
//     }
// }







// // $and: [
// //     { $or: [ {Username: {...}}, {Fullname: {...}} ] },
// //     { _id: { $ne: currentUserId } }
// // ]

// // This reads as: "Find users where (Username matches OR Fullname matches) AND (it's not me)." The .*searchterm.* regex pattern means "match this text anywhere in the string" (not just at the start), so searching "gour" would match "helloGourav" too.

// // Your userRout.js and index.js — both fine
// // userRout.js — correctly imports from userHandlerController.js now, matching your actual filename. No bugs.
// // index.js — correctly imports and mounts the router (renamed to just router, which is fine, just a naming choice — no functional issue). No bugs.
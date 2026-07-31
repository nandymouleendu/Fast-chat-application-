//by this it can make a chat come infront/ontop based on the timestamp
import express from "express"
import isLogin from "../middleware/isLogin.js";
import { getAllUsers, getCorrentChatters, getUserBySearch } from "../RouteController/userHandlerController.js";

const router = express.Router()

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCorrentChatters);

router.get('/all', isLogin, getAllUsers);

export default router
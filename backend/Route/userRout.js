//by this it can make a chat come infront/ontop based on the timestamp
import express from "express"
import isLogin from "../middleware/isLogin.js";
import { getAllUsers, getCorrentChatters, getUserBySearch } from "../RouteController/userHandlerController.js";

const router = express.Router()

router.get('/search',isLogin,getUserBySearch);//any get functions first goes through islogin then (must be authenticated), and only then reaches getUserBySearch, which queries MongoDB for users matching the search term in Username or Fullname

router.get('/currentchatters',isLogin,getCorrentChatters);

router.get('/all', isLogin, getAllUsers);

export default router
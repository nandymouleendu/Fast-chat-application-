import express from "express"
import isLogin from "../middleware/isLogin.js";
import upload from "../middleware/upload.js";
import { getMessages, sendMessage } from "../RouteController/messagerothController.js";

const router = express.Router()

router.post('/send/:id', isLogin, upload.single('media'), sendMessage)

router.get('/:id', isLogin, getMessages)

export default router
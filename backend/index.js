import express from "express";
import dotenv from "dotenv";
import path from "path";
import dbConnect from "./Database/dbConnect.js";
import authRouter from "./Route/authUser.js";
import messageRouter from "./Route/messageRout.js";
import router from "./Route/userRout.js";
import cookieParser from "cookie-parser";
import { app, server } from "./webSocket/socket.js";

const __dirname = path.resolve();//link my frontend to backend directly

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(`/api/auth`, authRouter);
app.use(`/api/message`, messageRouter);
app.use(`/api/user`, router);

app.use("/uploads", express.static(path.join(__dirname, "backend", "uploads")));

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/", (request, response) => {
    response.send("server is working");
});

app.use((request, response) => {
    response.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    dbConnect();
    console.log(`working at ${PORT}`);
});
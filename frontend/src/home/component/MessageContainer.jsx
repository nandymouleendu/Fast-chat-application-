import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../Zustans/userConversation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { GiConcentrationOrb } from "react-icons/gi";
import { FaPeopleCarry, FaPaperclip, FaFileAlt, FaTimes } from "react-icons/fa";
import axios from "axios";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSocketContext } from "../../context/socketContext.jsx";
import notify from "../../assets/sound/sample-12s.wav";

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessages, setSelectedConversation } = userConversation();
    const { authUser } = useAuth();
    const { socket } = useSocketContext();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const lastMessageRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        const unlockAudio = () => {
            const sound = new Audio(notify);
            sound.volume = 0;
            sound.play().catch(() => {});
            window.removeEventListener("click", unlockAudio);
        };
        window.addEventListener("click", unlockAudio);
        return () => window.removeEventListener("click", unlockAudio);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            const belongsToOpenChat =
                newMessage.senderId?.toString() === selectedConversation?._id?.toString();
            if (!belongsToOpenChat) return;

            const sound = new Audio(notify);
            sound.play().catch((err) => console.log("Audio playback blocked:", err));

            setMessages((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const alreadyExists = list.some((m) => m._id === newMessage._id);
                if (alreadyExists) return list;
                return [...list, newMessage];
            });
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, selectedConversation?._id, setMessages]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    useEffect(() => {
        const getMessage = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/message/${selectedConversation?._id}`, { withCredentials: true });
                const data = get.data;

                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                    setMessages([]);
                    return;
                }

                setLoading(false);
                setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                setLoading(false);
                console.log(error);
                setMessages([]);
            }
        };

        if (selectedConversation?._id) {
            getMessage();
        }
    }, [selectedConversation?._id, setMessages]);

    const handleBack = () => {
        setSelectedConversation(null);
        if (onBackUser) onBackUser();
    };

    const handelMessage = (e) => {
        setSendData(e.target.value);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sendData.trim() && !selectedFile) return;

        setSending(true);
        try {
            const formData = new FormData();
            formData.append("message", sendData);
            if (selectedFile) {
                formData.append("media", selectedFile);
            }

            const response = await axios.post(
                `/api/message/send/${selectedConversation?._id}`,
                formData,
                { withCredentials: true }
            );
            const data = response.data;

            if (data.success === false) {
                setSending(false);
                console.log(data.message);
                return;
            }

            setSending(false);
            setMessages((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                const alreadyExists = list.some((m) => m._id === data._id);
                if (alreadyExists) return list;
                return [...list, data];
            });
            setSendData("");
            clearSelectedFile();
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    };

    const renderMedia = (media) => {
        if (!media || !media.url) {
            return null;
        }

        if (media.type === "image") {
            return (
                <img
                    src={media.url}
                    alt={media.fileName}
                    className="max-w-[220px] max-h-[220px] rounded-lg mb-1 object-cover"
                />
            );
        }

        if (media.type === "video") {
            return (
                <video
                    src={media.url}
                    controls
                    className="max-w-[220px] max-h-[220px] rounded-lg mb-1"
                />
            );
        }

        return (
            <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 mb-1 hover:bg-gray-600"
            >
                <FaFileAlt size={20} />
                <span className="text-sm truncate max-w-[150px]">{media.fileName}</span>
            </a>
        );
    };

    return (
        <div className="md:min-w-[400px] h-[98%] flex flex-col py-2">
            {selectedConversation === null ? (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
                        <p className="text-2xl">Ajao mere pyare {authUser?.Fullname}</p>
                        <p className="text-lg">Abhi suru karte hai</p>
                        <GiConcentrationOrb className="text-6xl text-center" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 bg-yellow-600 px-2 h-14 w-full shrink-0 rounded-lg">
                            <div className="md:hidden ml-1">
                                <button onClick={handleBack} className="bg-white rounded-full px-2 py-1">
                                    <FaPeopleCarry size={25} />
                                </button>
                            </div>

                            <img
                                className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                                src={selectedConversation?.ProfilePic || undefined}
                            />

                            <span className="text-gray-950 text-sm md:text-xl font-bold">
                                {selectedConversation?.Username}
                            </span>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {loading && (
                                <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                                    <div className="loading loading-spinner"></div>
                                </div>
                            )}

                            {!loading && Array.isArray(messages) && messages.length === 0 && (
                                <div>
                                    <p className="text-center text-red items-center">
                                        Ki korcho akhono joldi message koro(gulabi dil)
                                    </p>
                                </div>
                            )}

                            {!loading && Array.isArray(messages) && messages.length > 0 &&
                                messages.map((message) => (
                                    <div className="text-white" key={message?._id} ref={lastMessageRef}>
                                        <div
                                            className={`chat ${
                                                message.senderId?.toString() === authUser?._id?.toString()
                                                    ? "chat-end"
                                                    : "chat-start"
                                            }`}
                                        >
                                            <div className="chat-image avatar"></div>
                                            <div
                                                className={`chat-bubble ${
                                                    message.senderId?.toString() === authUser?._id?.toString()
                                                        ? "bg-sky-600"
                                                        : ""
                                                }`}
                                            >
                                                {renderMedia(message.media)}
                                                {message?.message && <p>{message.message}</p>}
                                            </div>
                                            <div className="chat-footer text-[13px] opacity-90 text-white">
                                                {new Date(message?.createdAt).toLocaleDateString("en-IN")}{" "}
                                                {new Date(message?.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {selectedFile && (
                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 mx-2 mb-2 text-white">
                            {previewUrl ? (
                                selectedFile.type.startsWith("image/") ? (
                                    <img src={previewUrl} className="w-12 h-12 rounded object-cover" />
                                ) : (
                                    <video src={previewUrl} className="w-12 h-12 rounded object-cover" />
                                )
                            ) : (
                                <FaFileAlt size={20} />
                            )}
                            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                            <button type="button" onClick={clearSelectedFile}>
                                <FaTimes />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="rounded-full text-black flex items-center gap-2 px-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="text-gray-700 bg-white rounded-full p-2 shrink-0"
                        >
                            <FaPaperclip size={20} />
                        </button>

                        <div className="w-full rounded-full flex items-center bg-white">
                            <input
                                value={sendData}
                                onChange={handelMessage}
                                id="message"
                                type="text"
                                className="w-full bg-transparent outline-none px-4 rounded-full"
                            />
                            <button type="submit">
                                {sending ? (
                                    <div className="loading loading-spinner"></div>
                                ) : (
                                    <RiSendPlaneFill
                                        size={25}
                                        className="text-gray-700 cursor-pointer rounded-full bg-gray-800 h-auto p-1"
                                    />
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default MessageContainer;
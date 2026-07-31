import React, { useEffect, useState } from "react";
import { FaSearchDollar } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import userConversation from "../../Zustans/userConversation";
import { useSocketContext } from "../../context/socketContext";

const Sidebar = ({ onSelectUser }) => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setloading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const {
        selectedConversation,
        setSelectedConversation,
        unreadCounts,
        incrementUnread,
        clearUnread,
    } = userConversation();

    const { onlineUser, socket } = useSocketContext();

    useEffect(() => {
        const allUsersHandler = async () => {
            setloading(true);
            try {
                const allUsers = await axios.get(`/api/user/all`, { withCredentials: true });
                const data = allUsers.data;

                if (data.success === false) {
                    setloading(false);
                    toast.error(data.message);
                    return;
                }
                setloading(false);
                setChatUser(data);
            } catch (error) {
                setloading(false);
                console.log(error);
            }
        };
        allUsersHandler();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            const senderId = newMessage.senderId?.toString();
            const openChatId = selectedConversation?._id?.toString();

            const isCurrentlyOpenChat = senderId === openChatId;

            if (!isCurrentlyOpenChat) {
                incrementUnread(senderId);
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, selectedConversation?._id, incrementUnread]);

    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const search = await axios.get(
                `/api/user/search?search=${searchInput}`,
                { withCredentials: true }
            );
            const data = search.data;

            if (data.success === false) {
                setloading(false);
                toast.error(data.message);
                return;
            }

            setloading(false);

            if (data.length === 0) {
                toast.info("No users found");
                setSearchUser([]);
            } else {
                setSearchUser(data);
            }
        } catch (error) {
            setloading(false);
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handelUserClick = (clickedUser) => {
        setSelectedConversation(clickedUser);
        setSelectedUserId(clickedUser._id);
        clearUnread(clickedUser._id);
        if (onSelectUser) onSelectUser(clickedUser);
    };

    const handleBackClick = () => {
        setSearchUser([]);
        setSearchInput('');
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('To Talk Under Me');
            setAuthUser(null);
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while logging out");
        }
    };

    return (
        <div className="h-full w-auto px-1">
            <div className="flex justify-between items-center gap-2">
                <form
                    onSubmit={handelSearchSubmit}
                    className="w-auto flex items-center justify-between bg-black rounded-full"
                >
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text"
                        className="px-4 w-auto bg-transparent outline-none rounded-full"
                        placeholder="search your friend"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-square bg-red-950 hover:bg-gray-950"
                    >
                        <FaSearchDollar />
                    </button>
                </form>

                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.ProfilePic || undefined}
                    className="self-center h-12 w-12 hover:scale-110 cursor-pointer rounded-full"
                />

                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="text-white hover:text-red-500 hover:scale-110 cursor-pointer text-2xl"
                >
                    <IoLogOutOutline />
                </button>
            </div>

            <div className="divider px-3"></div>

            {searchUser?.length > 0 ? (
                <div className="mt-4">
                    <div
                        onClick={handleBackClick}
                        className="flex items-center gap-1 cursor-pointer hover:bg-green-800 rounded p-2 w-fit text-white"
                    >
                        <IoIosArrowBack size={20} />
                        <span className="text-sm">Fall Back To Safe Zone</span>
                    </div>

                    {loading && <p className="text-white">Searching...</p>}

                    {searchUser.map((user) => {
                        const matchedField =
                            user.Username.toLowerCase().includes(searchInput.toLowerCase())
                                ? user.Username
                                : user.Fullname;

                        return (
                            <div
                                key={user._id}
                                onClick={() => handelUserClick(user)}
                                className="p-2 text-white cursor-pointer hover:bg-gray-800 rounded"
                            >
                                {matchedField}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                    <div className="w-auto">
                        {chatUser.length === 0 ? (
                            <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                                <h1>Why are u alone at home, just message!!!</h1>
                                <h1>Search Username</h1>
                            </div>
                        ) : (
                            chatUser.map((user) => {
                                const isUserOnline = onlineUser.includes(user._id);
                                const unreadCount = unreadCounts[user._id] || 0;

                                return (
                                    <div key={user._id}>
                                        <div
                                            onClick={() => handelUserClick(user)}
                                            className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                                                selectedUserId === user._id ? 'bg-sky-500' : ''
                                            }`}
                                        >
                                            <div className="relative w-12 h-12 shrink-0">
                                                <img
                                                    src={user.ProfilePic || undefined}
                                                    alt="user avatar"
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                {isUserOnline && (
                                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full" />
                                                )}
                                            </div>

                                            <div className="flex flex-col flex-1 min-w-0">
                                                <p className="font-bold text-gray-950 truncate">{user.Username}</p>
                                                <span className="text-white text-sm truncate">
                                                    {user.Fullname || user.Username}
                                                </span>
                                            </div>

                                            {unreadCount > 0 && (
                                                <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shrink-0">
                                                    +{unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="divider divide-solid px-3 h-[1px]"></div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./component/Sidebar";
import MessageContainer from "./component/MessageContainer";

const Home = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { authUser } = useAuth();

    const handelUserSelect = () => {
        setIsSidebarVisible(false);
    };

    const handelShowSidebar = () => {
        setIsSidebarVisible(true);
    };

    return (
        <div className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter bg-opacity-15">
            <div className={`w-full py-2 md:flex md:w-auto ${isSidebarVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handelUserSelect} />
            </div>

            <div className="divider divider-horizontal px-3 hidden md:flex"></div>

            <div className={`flex-1 ${isSidebarVisible ? 'hidden md:flex' : 'flex'}`}>
                <MessageContainer onBackUser={handelShowSidebar} />
            </div>
        </div>
    );
};

export default Home;
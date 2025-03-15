import { Chat, Shapes, SignOut, UserCircle } from "@phosphor-icons/react";
import React, { useState } from "react";
import DarkMode from "../components/DarkMode";
import { useNavigate } from "react-router";
import { handleLogoutAPI, updateUserAPI } from "../apis/apis";
import { useDispatch, useSelector } from "../redux/store";
import { setActiveConversation } from "../redux/slices/activeConversation";
import { setUserInfo, userSelector } from "../redux/slices/userSlice";

const NAVIGATION = [
  {
    key: 0,
    title: "Dms",
    icon: <Chat size={24} />,
    path: "/home",
  },
  {
    key: 1,
    title: "Profile",
    icon: <UserCircle size={24} />,
    path: "/home/profile",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);

  const handleClick = (key) => {
    navigate(NAVIGATION[key].path);
    setSelected(key);
  };

  const handleLogout = async () => {
    await updateUserAPI(currentUser?._id, { status: "offline" });
    dispatch(setUserInfo(null));
    dispatch(setActiveConversation(null));
    await handleLogoutAPI();
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className='flex flex-col border-r border-stroke p-2 dark:border-strokedark '>
      <div className='flex flex-col items-center space-y-5'>
        <div className='space-y-2 flex flex-col text-center'>
          <div className='mx-auto border rounded-md border-stroke p-2 dark:border-strokedark'>
            <Shapes size={24} />
          </div>
          <span className='font-medium text-xs'>Workspace</span>
        </div>

        {NAVIGATION.map(({ icon, key, title }) => (
          <div
            key={key}
            className='space-y-2 flex flex-col text-center hover:cursor-pointer hover:text-primary'
            onClick={() => handleClick(key)}
          >
            <div
              className={`mx-auto border rounded-md border-stroke p-2 dark:border-strokedark ${selected === key && "bg-primary bg-opacity-90 text-white"
                } hover:border-primary dark:hover:border-primary`}
            >
              {icon}
            </div>
            <span
              className={`font-medium text-xs ${selected === key && "text-primary"
                }`}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
      <div className='flex flex-col grow'></div>

      <div className='space-y-2'>
        <div className='flex flex-row items-center justify-center'></div>
        <DarkMode />

        <button
          onClick={handleLogout}
          className='w-full flex flex-row items-center justify-center border rounded-md border-stroke p-2 dark:border-strokedark hover:bg-stone-100 hover:cursor-pointer'
        >
          <SignOut size={24} />
        </button>
      </div>
    </div>
  );
}

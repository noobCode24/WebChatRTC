import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import User01 from "../../assets/images/user/user-01.png";
import User02 from "../../assets/images/user/user-02.png";
import User03 from "../../assets/images/user/user-03.png";
import User04 from "../../assets/images/user/user-04.png";
import User05 from "../../assets/images/user/user-05.png";
import User06 from "../../assets/images/user/user-06.png";
import User07 from "../../assets/images/user/user-07.png";
import User08 from "../../assets/images/user/user-08.png";
import AddConversationModal from "../../components/AppModal/AddConversationModal";
import { getAllConversationsByUserId, getUserByIdAPI } from "../../apis/apis";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import {
  activeConversationSelector,
  setActiveConversation,
} from "../../redux/slices/activeConversation";

const List = [
  {
    imgSrc: User01,
    name: "Henry Dholi",
    message: "I cam across your profile and...",
  },
];
export default function ChatList() {
  const [selected, setSelected] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const dispatch = useDispatch();
  const activeConversation = useSelector(activeConversationSelector);

  const currentUser = useSelector(userSelector);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await getAllConversationsByUserId(currentUser?._id);
      setConversations(res);
    };
    fetchConversations();
  }, [currentUser?._id]);

  useEffect(() => {
    if (conversations?.length > 0) {
      const fetchReceivers = async () => {
        const participants = conversations?.map((conv) =>
          conv?.participants?.filter((p) => p.userId !== currentUser?._id)
        );

        const res = await Promise?.all(
          participants?.map((p) => {
            return getUserByIdAPI(p?.[0]?.userId);
          })
        );
        setReceivers(res);
      };
      fetchReceivers();
    }
  }, [conversations, currentUser?._id]);

  // const [last]
  // useEffect(() => {
  //   const handleReceiveMessage = ({ conversationId, message, type }) => {
  //     console.log("🚀 ~ useEffect ~ message:", message);
  //     if (
  //       conversationId === activeConversation?._id &&
  //       message?.senderId !== currentUser?._id
  //     ) {
  //       setMessages((prev) => [...prev, message]);
  //     }
  //   };

  //   socket.on("receiveMessage", handleReceiveMessage);
  //   return () => {
  //     socket.off("receiveMessage", handleReceiveMessage);
  //   };
  // }, [activeConversation?._id, currentUser?._id]);

  return (
    <div className='hidden h-full flex-col xl:flex xl:w-1/4'>
      <div className='flex flex-row place-content-between items-center sticky border-b border-stroke dark:border-strokedark px-5 py-4.5'>
        <h3 className='text-lg font-medium text-black dark:text-white 2xl:text-title-md2'>
          Chat List
        </h3>
        <AddConversationModal />
      </div>

      <div className='flex max-h-full flex-col overflow-auto p-5 no-scrollbar'>
        <from className='sticky'>
          <input
            placeholder='Search...'
            type='text'
            className='w-full rounded border border-stroke bg-gray-2 py-2 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2'
          />
          <button className='absolute right-4 top-1/2 -translate-y-1/2'>
            <MagnifyingGlass size={20} />
          </button>
        </from>
      </div>

      <div className='no-scrollbar overflow-auto max-h-full space-y-2.5'>
        {/* Chat List item */}
        {receivers.map((receiver, index) => {
          return (
            <div
              className={`flex items-center rounded px-4 py-2 ${
                selected === index
                  ? "bg-gray dark:bg-boxdark-2 cursor-default"
                  : "cursor-pointer hover:bg-gray-2 dark:hover:bg-strokedark"
              }`}
              key={index}
              onClick={() => {
                setSelected(index);
                dispatch(setActiveConversation(conversations[index]));
              }}
            >
              <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
                <img
                  src={receiver?.avatar || "/public/vite.svg"}
                  alt='profile'
                  className='h-full w-full rounded-full object-cover-center'
                />

                {receiver?.status === "online" && (
                  <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success'></span>
                )}
              </div>

              <div className='w-full'>
                <h5 className='text-sm font-medium text-black dark:text-white'>
                  {receiver.name}
                </h5>
                <p className='text-sm'>{receiver?.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

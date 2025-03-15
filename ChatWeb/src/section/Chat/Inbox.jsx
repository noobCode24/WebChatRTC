import React, { useEffect, useRef, useState } from "react";
import {
  DotsThree,
  Gif,
  LinkSimple,
  Microphone,
  PaperPlaneTilt,
  Phone,
  Smiley,
  VideoCamera,
} from "@phosphor-icons/react";
import User01 from "../../assets/images/user/user-01.png";
import Dropdown from "../../components/Dropdown";
import EmojiPicker from "../../components/EmojiPicker";
import UserInfo from "./UserInfo";
import Giphy from "../../components/Giphy";
import Attachment from "../../components/Attachment";
import MsgSeparator from "../../components/MsgSeparator";
import TypingIndicator from "../../components/TypingIndicator";
import {
  DocumentMessage,
  MediaMessage,
  TextMessage,
} from "../../components/Messages";
import VideoCall from "../../components/VideoCall";
import AudioCall from "../../components/AudioCall";
import { useSelector } from "../../redux/store";
import { activeConversationSelector } from "../../redux/slices/activeConversation";
import {
  createMessageAPI,
  getAllMessagesByConversationIdAPI,
  getUserByIdAPI,
} from "../../apis/apis";
import { userSelector } from "../../redux/slices/userSlice";
import { socket } from "../../socket/socket";
// import { useDispatch } from 'react-redux';
// import { ToggleAudioModal } from '../../redux/slices/app';
export default function Inbox() {
  // const dispatch = useDispatch()
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const [audioCall, setAudioCall] = useState(false);
  const [gifOpen, setGiphyOpen] = useState(false);
  const activeConversation = useSelector(activeConversationSelector);
  const currentUser = useSelector(userSelector);
  const [receiver, setReceiver] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const elementRef = useRef(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (activeConversation?.participants) {
        const receiverId = activeConversation?.participants?.find(
          (p) => p.userId !== currentUser?._id
        )?.userId;
        const res = await getUserByIdAPI(receiverId);
        if (res) {
          setReceiver(res);
        }
      }
    };
    fetchReceiver();
  }, [activeConversation?.participants, currentUser?._id]);

  const handleToggleGiphy = (e) => {
    e.preventDefault();
    setGiphyOpen(!gifOpen);
  };

  const handleToggleVideoCall = () => {
    setVideoCall(!videoCall);
  };

  const handleToggleAudioCall = (e) => {
    e.preventDefault();
    setAudioCall(!audioCall);
  };

  const handleToggleUserInfo = () => {
    setUserInfoOpen(!userInfoOpen);
  };

  const handleKeyDown = (key) => {
    if (key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const message = {
      conversationId: activeConversation?._id,
      content: inputValue,
      senderId: currentUser?._id,
      receiverIds: [
        {
          receiverId: receiver?._id,
        },
      ],
      type: "text",
    };
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("sendMessage", {
      conversationId: message.conversationId,
      message,
      type: message.type,
    });
    const res = await createMessageAPI(message);
    if (res) {
      setMessages((prev) => [...prev, res]);
      setInputValue("");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  useEffect(() => {
    if (activeConversation?._id) {
      const fetchMessages = async () => {
        const res = await getAllMessagesByConversationIdAPI(
          activeConversation?._id
        );
        if (res) {
          setMessages(res);
        }
      };
      fetchMessages();
    }
  }, [activeConversation?._id]);

  useEffect(() => {
    const handleReceiveMessage = ({
      conversationId,
      message,
      type,
      receiverFilesBuffer,
      senderFiles,
    }) => {
      console.log("🚀 ~ useEffect ~ senderFiles:", senderFiles);
      console.log("🚀 ~ useEffect ~ receiverFilesBuffer:", receiverFilesBuffer);

      let processedFiles;
      if (message?.type !== "text") {
        if (receiverFilesBuffer && receiverFilesBuffer.length > 0) {
          processedFiles = receiverFilesBuffer.map((file) => {
            const blob = new Blob([file.buffer], { type: file.type });
            const url = URL.createObjectURL(blob);
            return {
              type: file.type,
              url,
              name: file.name,
              size: file.size,
            };
          });
          console.log(
            "🚀 ~ processedFiles=receiverFilesBuffer.map ~ processedFiles:",
            processedFiles
          );
        }
        if (senderFiles && receiverFilesBuffer) {
          if (currentUser?._id === message?.senderId) {
            message.files = senderFiles;
          } else if (
            message?.receiverIds?.some((r) => r.receiverId === currentUser?._id)
          ) {
            message.files = processedFiles;
          }
        }
      }
      if (conversationId === activeConversation?._id) {
        if (message.type === "text") {
          if (message?.senderId !== currentUser?._id) {
            console.log("🚀 ~ useEffect ~ message1:", message);
            setMessages((prev) => [...prev, message]);
          }
        } else {
          console.log("🚀 ~ useEffect ~ message2:", message);
          setMessages((prev) => [...prev, message]);
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [activeConversation?._id, currentUser?._id]);

  useEffect(() => {
    if (messages?.length > 0) {
      if (elementRef.current) {
        elementRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages?.length]);

  return (
    <>
      <div
        className={`flex h-full flex-col border-l border-stroke dark:border-strokedark ${userInfoOpen ? "xl:w-1/2" : " xl:w-3/4"
          }`}
      >
        {/*Chat header */}
        <div className='sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-5 py-3'>
          <div className='flex items-center'>
            <div
              className='mr-4.5 h-11.5 w-full max-w-11.5 rounded-full relative cursor-pointer'
              onClick={handleToggleUserInfo}
            >
              <img
                src={receiver?.avatar || "/public/vite.svg"}
                alt='avatar'
                className='h-full object-cover object-center'
              />
              {receiver?.status === "online" && (
                <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success'></span>
              )}
            </div>
            <div>
              <h5 className='font-medium text-black dark: dark:text-white text-nowrap'>
                {receiver?.name}
              </h5>
              <p className='text-sm'>
                {receiver?.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className='flex flex-row items-center space-x-5'>
            <button onClick={handleToggleVideoCall}>
              <VideoCamera size={22} />
            </button>
            <button onClick={handleToggleAudioCall}>
              <Phone size={22} />
            </button>
            <Dropdown />
          </div>
        </div>

        {/*Chat body */}
        <div
          className='max-h-full space-y-3.5 flex flex-col gap-2 overflow-auto px-5 py-7 grow'
          ref={elementRef}
        >
          {/* <MsgSeparator />
          <DocumentMessage
            timestamp={"11:01 am"}
            incoming={true}
            read_receipt={"read"}
            author={"Hoang Van Vu"}
          />
          <DocumentMessage
            timestamp={"11:01 am"}
            incoming={false}
            read_receipt={"read"}
          />
          <MsgSeparator />
          <MediaMessage
            assets={[]}
            timestamp={"11:49 am"}
            incoming={true}
            read_receipt={"read"}
            author={"Hoang Van Vu"}
            caption={"Đây là ảnh"}
          />
          <MediaMessage
            assets={[]}
            timestamp={"11:49 am"}
            incoming={false}
            read_receipt={"read"}
            caption={"Đây là ảnh"}
          /> */}
          {messages?.length > 0 &&
            messages?.map((msg, index) => {
              if (msg?.type === "text") {
                return (
                  <TextMessage
                    key={index}
                    timestamp={formatTime(new Date(msg?.createdAt).toLocaleString())}
                    content={msg?.content}
                    incoming={msg?.senderId !== currentUser?._id}
                  />
                );
              } else if (msg?.type === "media" && msg?.files?.length > 0) {
                return (
                  <MediaMessage
                    assets={msg?.files}
                    timestamp={formatTime(new Date(msg?.createdAt).toLocaleString())}
                    incoming={msg?.senderId !== currentUser?._id}
                    caption={msg?.content || ""}
                  />
                );
              } else if (msg?.type === "document" && msg?.files?.length > 0) {
                return (
                  <DocumentMessage
                    content={msg?.content}
                    files={msg?.files}
                    timestamp={formatTime(new Date(msg?.createdAt).toLocaleString())} // createdAt
                    incoming={msg?.senderId !== currentUser?._id}
                  // read_receipt={"read"}
                  />
                );
              }
            })}
        </div>

        {/*Chat footer */}
        <div className='sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark'>
          <div className='flex items-center justify-between space-x-4.5'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Type something here'
                className='h-12 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e.key)}
              />

              <div className='absolute flex right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4'>
                {/* <button onClick={handleMicClick} className='hover:text-primary' >
                  <Microphone size={20} />
                </button> */}
                <div className=''>
                  <Attachment />
                </div>
                <button
                  className='hover:text-primary'
                  onClick={handleToggleGiphy}
                >
                  <Gif size={20} />
                </button>
                <div className='hover:text-primary'>
                  {/* <Smiley size={24} /> */}
                  <EmojiPicker setInputValue={setInputValue} />
                </div>
              </div>
            </div>

            <button
              className='flex items-center justify-center h-12 max-w-12 w-full rounded-md bg-primary text-white hover:bg-opacity-90'
              onClick={handleSendMessage}
            >
              <PaperPlaneTilt size={24} weight='bold' />
            </button>
          </div>

          {gifOpen && <Giphy />}
        </div>
      </div>
      {videoCall && (
        <VideoCall open={videoCall} handleClose={handleToggleVideoCall} />
      )}
      {audioCall && (
        <AudioCall open={audioCall} handleClose={handleToggleAudioCall} />
      )}

      {userInfoOpen && (
        <div className='w-1/4'>
          <UserInfo handleToggleUserInfo={handleToggleUserInfo} />
        </div>
      )}
    </>
  );
}

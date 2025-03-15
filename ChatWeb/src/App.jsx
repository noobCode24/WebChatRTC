import { Navigate, Route, Routes } from "react-router";
import Messages from "./pages/Messages";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Verification from "./pages/auth/Verification";
import { useEffect, useMemo, useState } from "react";
import Profile from "./pages/Profile";
import Layout from "./layout";
import { userSelector } from "./redux/slices/userSlice";
import { getAllConversationsByUserId } from "./apis/apis";
import { socket } from "./socket/socket";
import { useSelector } from "./redux/store";

function App() {
  const currentUser = useSelector(userSelector);
  const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);
  const [conversationIds, setConversationIds] = useState([]);

  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));

    const className = "dark";
    const bodyClass = window.document.body.classList;
    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (currentUser?._id) {
        const res = await getAllConversationsByUserId(currentUser?._id);
        const ids = res.map((conversation) => conversation?._id);
        setConversationIds(ids);
      }
    };

    fetchConversations();
  }, [currentUser?._id]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!socket.connected) {
        socket.connect();
      }
      const userId = currentUser?._id;

      socket.on("connect", () => {
        console.log("Connected from server");
        socket.emit("registerUser", userId);
        socket.emit("sendSignalOnline", { friendId: userId });
      });

      if (conversationIds.length > 0) {
        for (const conversationId of conversationIds) {
          socket.emit("joinConversation", {
            userId: currentUser?._id,
            conversationId,
          });
        }
      }

      return () => {
        console.log("Disconnected from server");
        socket.disconnect();
      };
    }
  }, [isAuthenticated, currentUser?._id, conversationIds]);

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/auth/login' />} />
      <Route path='/auth/login' element={<Login />} />
      <Route path='/auth/signup' element={<Signup />} />
      <Route path='/auth/verify' element={<Verification />} />

      <Route path='home' element={<Layout />}>
        <Route index element={<Messages />} />
        <Route path='profile' element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;

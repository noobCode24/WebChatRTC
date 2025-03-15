import { io } from "socket.io-client";
import { API_HOST } from "../config/constants";

export const socket = io(API_HOST, {
  autoConnect: false,
  withCredentials: true
});

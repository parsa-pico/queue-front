import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import { ClickButton } from "../Common/commonComponents";
import { getDecodedToken } from "../Services/authService";
import alertSound from "../sounds/alert.wav";

export default function RoomStudent() {
  const [audio, setAudio] = useState(new Audio(alertSound));
  const user = getDecodedToken();
  const location = useLocation();
  const nav = useNavigate();
  const [room, setRoom] = useState({});
  const [queue, setQueue] = useState([]);
  const [isInQueue, setIsInQueue] = useState(true);
  const [isFirst, setIsFirst] = useState(false);
  const [remaning, setRemaning] = useState(0);
  function subscribe() {
    return socket.emitWithPromise("subscribe", room._id);
  }
  function handleUpdateQueue(queue) {
    console.log(queue);
    setQueue(queue);
  }

  useEffect(() => {
    if (!location.state) nav("/rooms");
    const { state } = location;
    setRoom(state);
    setQueue(state.queue);
    socket.connectWithToken();
    socket.on("updateQueue", handleUpdateQueue);
    socket.emit("getroom", state._id, (result) => {
      setQueue(result);
    });

    return () => {
      socket.removeAllListeners("updateQueue");
    };
  }, []);
  useEffect(() => {
    const index = queue.findIndex((id) => id === user._id);
    if (index === -1) {
      setIsFirst(false);
      setIsInQueue(false);
      return;
    }
    if (index === 0) {
      setIsInQueue(true);
      setIsFirst(true);
      audio.play();

      return;
    }
    setRemaning(index);
    setIsInQueue(true);
    setIsFirst(false);
  }, [queue]);

  return (
    <div>
      <h2>{room.title}</h2>
      {!isInQueue && (
        <ClickButton onClick={subscribe} className="btn btn-primary">
          گرفتن نوبت
        </ClickButton>
      )}
      {isInQueue && !isFirst && (
        <h5 style={{ direction: "rtl" }}>{remaning}نفر تا نوبت شما </h5>
      )}
      {isFirst && <h2 style={{ direction: "rtl" }}>نوبت شما فرارسیده!</h2>}
    </div>
  );
}

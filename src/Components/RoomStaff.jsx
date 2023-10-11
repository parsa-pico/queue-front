import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { Button, Card, Col, Row } from "react-bootstrap";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { ClickButton, simpleToolTip } from "../Common/commonComponents";
import Switch from "react-switch";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import helpIcon from "../icons/help.png";

export default function RoomStaff() {
  const location = useLocation();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [queue, setQueue] = useState([]);
  const [queueLength, setQueueLength] = useState(0);
  const [currentRoom, setCurrentRoom] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  function handleUpdateQueue(queue) {
    console.log(queue);
    setQueueLength(queue.length);
    setQueue(queue);
  }

  useEffect(() => {
    if (!location.state) {
      nav("/rooms");
    }

    const { state } = location;
    setTitle(state.title);

    setCurrentRoom(state._id);

    socket.connectWithToken();
    socket.on("updateQueue", handleUpdateQueue);
    socket.emit("joinRoom", location.state._id, (room) =>
      setIsWorking(room.isWorking)
    );
    socket.on("queueLength", (len) => {
      setQueueLength(len);
    });
    return () => {
      socket.off("updateQueue", handleUpdateQueue);
      socket.emit("leaveRoom");
      socket.removeAllListeners("queueLength");
    };
  }, []);
  function nextPerson() {
    return socket.emitWithPromise("next", currentRoom);
  }
  function copyElement(textToCopy) {
    return (
      <small
        onClick={() => {
          navigator.clipboard.writeText(textToCopy);
          toast("کپی شد", {
            autoClose: 200,
            theme: "dark",
            transition: Zoom,
          });
        }}
        className="m-2 clickable"
      >
        کپی
      </small>
    );
  }
  async function handleIsWorking(checked) {
    try {
      const result = await socket.emitWithPromise("workingState", {
        _id: currentRoom,
        isWorking: checked,
      });

      if (result === true) setIsWorking(checked);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h2>{title}</h2>

      <div className="roomIsWroking">
        <Switch onChange={handleIsWorking} checked={isWorking} />
        <p>وضعیت اتاق</p>
        <OverlayTrigger
          overlay={simpleToolTip(
            "tip1",
            "در صورتی که وضعیت اتاق غیر فعال باشد دانشجویان نمیتوانند نوبت دریافت کنند"
          )}
          placement="top"
        >
          <img className="img-fluid help-icon" src={helpIcon} />
        </OverlayTrigger>
      </div>

      <h6 className="mt-4 mb-4">{queueLength}:تعداد کل افراد در صف</h6>
      {queueLength === 0 && <h3>نوبت فعالی وجود ندارد</h3>}
      {queueLength !== 0 && (
        <div className="mt-4">
          <h5>نوبت فعلی</h5>
          <Card>
            <Card.Body>
              <Card.Title>{`${queue[0].firstName} ${queue[0].lastName}`}</Card.Title>
              <Card.Text>
                <strong>شماره دانشجویی:</strong> {queue[0].studentCode}
                {copyElement(queue[0].studentCode)}
                <br />
                <strong>شماره تماس :</strong> {queue[0].phoneNumber}
                {copyElement(queue[0].phoneNumber)}
              </Card.Text>
            </Card.Body>
          </Card>

          {queueLength !== 0 && (
            <ClickButton className="btn btn-primary mt-4" onClick={nextPerson}>
              بعدی
            </ClickButton>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

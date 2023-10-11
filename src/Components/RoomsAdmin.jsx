import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader, getDecodedToken, getToken } from "../Services/authService";
import { useLocation, useNavigate } from "react-router-dom";

const RoomsAdmin = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const nav = useNavigate();

  const location = useLocation();

  const handleItemClick = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  async function search(user) {
    console.log(user);
    if (!user || user.id) return alert("کارمند انتخاب نشده است");
    tryHTTP(async () => {
      let { data } = await httpService.get("/admin/room/" + user._id, {
        ...authHeader,
      });
      if (data && data.length > 0) {
        data = data.map((obj) => obj.roomDetails);
        setRooms(data);
      }
    });
  }

  useEffect(() => {
    const { state } = location;
    search(state);
    setCurrentUser(state);
  }, []);

  function getHeader() {
    let name = "";
    console.log(currentUser);
    if (currentUser.firstName)
      name = currentUser.firstName + " " + currentUser.lastName;
    const text = `اتاق های ${name}`;
    return <h2> {text}</h2>;
  }
  return (
    <div className="courses-list">
      {getHeader()}

      <Button
        onClick={() => nav("/add-room", { state: currentUser })}
        className="mt-2 mb-4"
      >
        اتاق جدید
      </Button>
      {rooms && rooms.length === 0 && (
        <h3 className="mt-4">اتاقی ثبت نشده است</h3>
      )}
      {rooms &&
        rooms.length !== 0 &&
        rooms.map((room, index) => {
          return (
            <Card
              style={{ borderRadius: "0", cursor: "pointer" }}
              onClick={() => handleItemClick(index)}
              key={index}
              className={"course-card " + "text-white"}
              bg={(index === expandedIndex && "dark") || "secondary"}
            >
              <Card.Body>
                <Card.Title> {room.title}</Card.Title>
                <p style={{ direction: "rtl" }}>
                  {room.queue.length}
                  {"  "}
                  نفر در صف
                </p>
                <div>{index === expandedIndex && <div></div>}</div>
              </Card.Body>
            </Card>
          );
        })}
    </div>
  );
};

export default RoomsAdmin;

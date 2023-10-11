import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader, getDecodedToken, getToken } from "../Services/authService";
import NameSearch from "./NameSearch";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "./../socket";
import SurveyModal from "./SurveyModal";

const Rooms = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const user = getDecodedToken();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [rooms, setRooms] = useState([]);
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [survey, setSurvey] = useState({});

  const location = useLocation();

  const FirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const LastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleItemClick = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  async function search() {
    tryHTTP(async () => {
      let { data } = await httpService.get("/admin/rooms", {
        ...authHeader,
      });
      if (data && data.length > 0) {
        data = data.map((obj) => obj.roomDetails);
        setRooms(data);
      }
    });
  }
  async function searchNonStaff() {
    tryHTTP(async () => {
      const { data } = await httpService.get("/student/rooms", authHeader);

      setRooms(data);
    });
  }
  function getForm() {
    tryHTTP(async () => {
      const { data } = await httpService.get("/student/form", authHeader);
      if (data) {
        setShowSurvey(true);
        setSurvey(data);
      }
    });
  }
  useEffect(() => {
    socket.connectWithToken();

    if (!user.isStaff) {
      searchNonStaff();
      // getForm();
    } else {
      search();
    }
  }, []);

  const handleSurveyYes = () => {
    setShowSurvey(false);
    nav("/answer-form", { state: survey });
  };
  function getHeader() {
    if (user.isStaff) return <h1>اتاق های من</h1>;
    else return <h1>اتاق ها</h1>;
  }
  function getFloor(floor) {
    let text = "";
    if (floor === 0) {
      floor = "همکف";
      text = ` طبقه: ${floor} `;
    } else text = `${floor} :طبقه `;

    return floor !== undefined && <p>{text}</p>;
  }
  return (
    <div className="courses-list">
      {getHeader()}
      {/* ADD THIS LATER */}
      {/* {!user.isStaff && (
        <NameSearch
          fChange={FirstNameChange}
          lChange={LastNameChange}
          search={search}
          name={{ firstName, lastName }}
        />
      )} */}
      {rooms && rooms.length === 0 && (
        <h3 className="mt-4">اتاقی برای شما ثبت نشده است</h3>
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
                {getFloor(room.floor)}
                <p style={{ direction: "rtl" }}>
                  {room.queue.length}
                  {"  "}
                  نفر در صف
                </p>
                <div>
                  {index === expandedIndex && (
                    <div>
                      {
                        <span>
                          {!user.isStaff && (
                            <Button
                              onClick={() => {
                                nav("/room-student", { state: room });
                              }}
                            >
                              گرفتن وقت
                            </Button>
                          )}
                          {user.isStaff && (
                            <Button
                              onClick={() => {
                                // socketState.emit("next", room._id);
                                nav("/room-staff", { state: room });
                              }}
                            >
                              ورود
                            </Button>
                          )}
                        </span>
                      }
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      <SurveyModal
        handleYesClick={handleSurveyYes}
        show={showSurvey}
        setShow={setShowSurvey}
      />
    </div>
  );
};

export default Rooms;

// import Home from "./Components/Home";
import AddUserForm from "./Components/AddUser";
import Rooms from "./Components/Rooms";
import LoginStudent from "./Components/LoginStudent";
import MenuBar from "./Components/MenuBar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { getToken } from "./Services/authService";
import { useEffect, useState } from "react";
import ResetPass from "./Components/ResetPass";
import LoginTeacher from "./Components/LoginTeacher";
import RoomStudent from "./Components/RoomStudent";
import RoomStaff from "./Components/RoomStaff";
import { socket } from "./socket";
import FormMaker from "./Components/FormMaker";
import GetForms from "./Components/GetForms";
import AnswerForm from "./Components/AnswerForm";
import AddStaffForm from "./Components/AddStaff";
import Staff from "./Components/Staff";
import RoomsAdmin from "./Components/RoomsAdmin";
import AddRoom from "./Components/AddRoom";

function App() {
  const loc = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [loc]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("error", (err) => {
      alert(err.msg);
    });
    return () => {
      if (socket.connected) socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);
  return (
    <div className="App">
      {getToken() && <MenuBar />}
      <Routes>
        <Route path="/" exact element={<Navigate to={"/login-student"} />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />
        <Route path="/add-staff" element={<AddStaffForm />} />
        <Route path="/add-student" element={<AddUserForm />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/rooms-admin" element={<RoomsAdmin />} />
        <Route path="/room-student" element={<RoomStudent />} />
        <Route path="/room-staff" element={<RoomStaff />} />
        <Route path="/reset-pass" element={<ResetPass />} />
        <Route path="/make-form" element={<FormMaker />} />
        <Route path="/get-forms" element={<GetForms />} />
        <Route path="/answer-form" element={<AnswerForm />} />
      </Routes>
    </div>
  );
}

export default App;

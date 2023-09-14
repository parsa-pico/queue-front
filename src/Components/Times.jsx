import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PersianCalendar from "./PersianCalender";
import httpService from "../Services/httpService";
import { areDatesOnSameDay, tryHTTP } from "../Common/commonFuncs";
import { authHeader } from "../Services/authService";
import { Input } from "../Common/Inputs";
import { Button, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const JDate = require("jalali-date");
export default function Times() {
  const location = useLocation();
  const [buttonText, setButtonText] = useState("ثبت");
  const [date, setDate] = useState(new JDate());
  const [times, setTimes] = useState([]);
  const [didAttend, setDidAttend] = useState(false);
  const [updatedTime, setUpdatedTime] = useState(null);
  const [formTimes, setFormTimes] = useState({
    fromH: "",
    fromM: "",
    toH: "",
    toM: "",
  });

  useEffect(() => {
    tryHTTP(async () => {
      const courseId = location.state._id;

      let { data } = await httpService.get("/admin/times", {
        params: { courseId },
        ...authHeader,
      });
      data = data.map((obj) => ({ ...obj, date: new Date(obj.date) }));
      setTimes(data);
    });
  }, []);
  useEffect(() => {
    if (!location.state) return;
    const { days } = location.state;

    for (let time of times) {
      if (areDatesOnSameDay(time.date, date._d)) {
        let hour = time.date.getHours().toString().padStart(2, "0");
        let minute = time.date.getMinutes().toString().padStart(2, "0");
        setFormTimes({
          ...formTimes,
          fromH: hour,
          fromM: minute,
        });
        setDidAttend(time.didAttend);
        setButtonText("تغییر");
        setUpdatedTime(time);
        return;
      }
    }
    setDidAttend(false);
    setButtonText("ثبت");
    setUpdatedTime(null);
    const fromTo = days[dayIndexToMyDayIndex(date)];
    if (fromTo) {
      const [from1, from2] = fromTo[0].split(":");
      const [to1, to2] = fromTo[1].split(":");
      setFormTimes({
        fromH: from1,
        fromM: from2,
        toH: to1,
        toM: to2,
      });
      return;
    }

    setFormTimes({
      fromH: "",
      fromM: "",
      toH: "",
      toM: "",
    });
  }, [date]);

  function dayIndexToMyDayIndex(date) {
    return (date.getDay() + 1) % 7;
  }
  function handleDayRender(year, month, day) {
    const thisDay = new JDate(year, month, day);
    let sign = "";
    const days = location.state.days;
    for (let { date, didAttend } of times) {
      // if times matched,remove it so dont search it again
      const currentDate = thisDay._d;
      const selectedDate = date;
      if (areDatesOnSameDay(currentDate, selectedDate)) {
        sign = didAttend ? "green" : "red";
      }
    }
    if (!sign) {
      const result = days[dayIndexToMyDayIndex(thisDay)];
      if (result) sign = "yellow";
    }
    return { classInfo: `day-${sign}` };
  }
  function handleTimeChange(e) {
    const { name, value } = e.target;
    setFormTimes({ ...formTimes, [name]: value });
  }
  function handleSubmit() {
    const gregorianDate = date._d;
    gregorianDate.setHours(
      parseInt(formTimes.fromH),
      parseInt(formTimes.fromM)
    );
    const courseId = location.state.courseId;

    let _id = "";
    if (updatedTime) _id = updatedTime._id;
    tryHTTP(async () => {
      if (!_id) {
        const { data } = await httpService.post(
          "/admin/times",
          { date: gregorianDate, didAttend, courseId },
          authHeader
        );
      } else {
        const { data } = await httpService.put(
          "/admin/times",
          { date: gregorianDate, didAttend, _id },
          authHeader
        );
      }
      alert("با موفقیت انجام شد");
      window.location = "/times";
    });
  }
  function getFormattedDate() {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }

  return (
    <div>
      <h1 className="mb-4">تقویم دوره</h1>
      <h5>
        {location.state.firstName} {location.state.lastName}
      </h5>
      <p>{location.state.level}دوره </p>
      <div className="time-inputs">
        <PersianCalendar
          changeDayInfo={handleDayRender}
          date={date}
          setDate={setDate}
        />
        <small className="mt-2">{getFormattedDate()}</small>
        <div className="mt-3">
          <label htmlFor="didAttend">شرکت کرد؟</label>
          <input
            checked={didAttend}
            onChange={(e) => {
              setDidAttend(e.target.checked);
            }}
            className="form-check-input time-check"
            id="didAttend"
            type="checkbox"
          />
        </div>
        <div className="time-input">
          <input
            value={formTimes.fromH}
            name="fromH"
            className="form-control "
            onChange={handleTimeChange}
          ></input>
          <h3>:</h3>
          <input
            value={formTimes.fromM}
            name="fromM"
            className="form-control"
            onChange={handleTimeChange}
          ></input>
          <span>از</span>
        </div>
        {/* <div className="time-input">
          <input
            value={formTimes.toH}
            name="toH"
            className="form-control"
            onChange={handleTimeChange}
          ></input>
          <h3>:</h3>
          <input
            value={formTimes.toM}
            name="toM"
            className="form-control"
            onChange={handleTimeChange}
          ></input>
          <span>تا</span>
        </div> */}
      </div>
      <Button onClick={handleSubmit}>{buttonText}</Button>
    </div>
  );
}

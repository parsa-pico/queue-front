import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
const JDate = require("jalali-date");

const PersianCalendar = ({ date, setDate, changeDayInfo }) => {
  const getMonthName = (month) => {
    const monthNames = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    return monthNames[month - 1];
  };

  const getDaysInMonth = (year, month) => {
    const persianMonths = {
      1: 31,
      2: 31,
      3: 31,
      4: 31,
      5: 31,
      6: 31,
      7: 30,
      8: 30,
      9: 30,
      10: 30,
      11: 30,
      12: 29, // or 30 in leap years
    };
    return persianMonths[month];
  };

  const handlePrevMonth = () => {
    const month = date.getMonth();
    const newMonth = month > 1 ? month - 1 : 12;
    setDate(new JDate(date.getFullYear(), newMonth, 1));
  };

  const handleNextMonth = () => {
    const month = date.getMonth();
    const newMonth = month < 12 ? month + 1 : 1;
    setDate(new JDate(date.getFullYear(), newMonth, 1));
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new JDate(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const startOffset = firstDayOfMonth === 6 ? 0 : firstDayOfMonth + 1;

    let calendarDays = [];
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(
        <div className="calendar-day empty" key={`empty-${i}`}></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const { classInfo } = changeDayInfo(year, month, day);
      calendarDays.push(
        <div
          onClick={() => {
            setDate(new JDate(year, month, day));
          }}
          className={`calendar-day ${classInfo}`}
          key={`day-${day}`}
        >
          <span>{day}</span>
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="persian-calendar">
      <div className="calendar-header">
        <Button onClick={handleNextMonth}>&lt;</Button>
        <h2 className="calendar-heading" style={{ margin: "0 1rem" }}>
          {getMonthName(date.getMonth())}
        </h2>
        <Button onClick={handlePrevMonth}>&gt;</Button>
      </div>
      <div className="calendar-body">
        <div>ش</div>
        <div>ی</div>
        <div>د</div>
        <div>س</div>
        <div>چ</div>
        <div>پ</div>
        <div>ج</div>
        {renderCalendar()}
      </div>
    </div>
  );
};

export default PersianCalendar;

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { Input } from "./../Common/Inputs";
import NameSearch from "./NameSearch";
import { useLocation, useNavigate } from "react-router-dom";

const CoursesList = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const handleItemClick = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const location = useLocation();
  const FirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const LastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const [courses, setCourses] = useState([]);

  async function search() {
    tryHTTP(async () => {
      const { data } = await httpService.get("/admin/courses", {
        ...authHeader,
        params: { firstName, lastName },
      });

      setCourses(data);
    });
  }
  useEffect(() => {
    let firstName = "";
    let lastName = "";
    if (location.state) {
      firstName = location.state.firstName;
      lastName = location.state.lastName;
      setFirstName(firstName);
      setLastName(lastName);
    }
    tryHTTP(async () => {
      const { data } = await httpService.get("/admin/courses", {
        ...authHeader,
        params: { firstName, lastName },
      });

      setCourses(data);
    });
  }, []);

  const days = {
    0: "شنبه",
    1: "یکشنبه",
    2: "دوشنبه",
    3: "سه‌شنبه",
    4: "چهارشنبه",
    5: "پنجشنبه",
    6: "جمعه",
  };

  return (
    <div className="courses-list">
      <h1>دوره ها</h1>
      <NameSearch
        fChange={FirstNameChange}
        lChange={LastNameChange}
        search={search}
        name={{ firstName, lastName }}
      />
      {courses.map((course, index) => (
        <Card
          style={{ borderRadius: "0" }}
          onClick={() => handleItemClick(index)}
          key={index}
          className={"course-card " + "text-white"}
          bg={
            (index === expandedIndex && "dark") ||
            (course.isFinished && "danger") ||
            "secondary"
          }
        >
          <Card.Body>
            <Card.Title>{`${course.firstName} ${course.lastName}`}</Card.Title>
            <div>
              <Row>
                <Col xs={6}>
                  <p> {course.level}:سطح</p>
                  <p>شهریه {course.paymentAmount}</p>
                </Col>
                <Col xs={6}>
                  <p> {course.isFinished ? "دوره تمام شده" : "دوره جاری"} </p>
                  <p> {course.payedAmount}:پرداختی</p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <h5>نمرات</h5>
                  <ul>
                    <li>Mid Term: {course.scores.midTerm}</li>
                    <li>Final: {course.scores.final}</li>
                    <li>Extra: {course.scores.extra}</li>
                    <li>Activity: {course.scores.activity}</li>
                  </ul>
                </Col>
                <Col>
                  <h5>روزها</h5>
                  <ul>
                    {Object.keys(course.days).map((day, index) => (
                      <li key={index}>
                        {days[day]} - {course.days[day][0]} تا{" "}
                        {course.days[day][1]}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
              {index === expandedIndex && (
                <div>
                  <Button
                    onClick={() => {
                      nav("/times", { state: course });
                    }}
                  >
                    تقویم
                  </Button>
                  <Button
                    variant="info"
                    className="m-2 text-white"
                    onClick={() => {
                      nav("/update-course", { state: course });
                    }}
                  >
                    تغییر
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default CoursesList;

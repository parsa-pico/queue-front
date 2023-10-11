import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { getDecodedToken, setToken } from "../Services/authService";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
const LoginTeacher = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    tryHTTP(async () => {
      const { data } = await httpService.post("/admin/login", {
        phoneNumber,
        password,
      });

      setToken(data);
      console.log(jwtDecode(data));
      window.location = "/rooms";
    });
  };
  function convertPersianToEnglishNumbers(persianNumber) {
    const persianToEnglishMap = {
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
    };

    return persianNumber.replace(
      /[۰-۹]/g,
      (match) => persianToEnglishMap[match]
    );
  }
  return (
    <Container className="mt-5">
      <h2 className="mb-4">خوش آمدید</h2>
      <h4 className="mb-4"> ورود کارمندان</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicPhone">
          <Form.Label>موبایل</Form.Label>
          <Form.Control
            type="text"
            placeholder="09"
            value={phoneNumber}
            onChange={(e) => {
              const { value } = e.target;

              const replaced = convertPersianToEnglishNumbers(value);

              setPhoneNumber(replaced);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>رمز</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-4 mb-4 w-100" variant="primary" type="submit">
          ورود
        </Button>
      </Form>
      {/* <Link style={{ textDecoration: "none" }} to={"/reset-pass"}>
        رمز را فراموش کرده اید؟
      </Link> */}
    </Container>
  );
};

export default LoginTeacher;

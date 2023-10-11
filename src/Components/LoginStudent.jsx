import React, { useState } from "react";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { setToken } from "../Services/authService";
import { Link } from "react-router-dom";
const LoginStudent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    tryHTTP(async () => {
      const { data } = await httpService.post("/student/login", {
        phoneNumber,
        password,
      });
      setToken(data);

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
  const publicKey =
    "BAk5I2kthzXPoK38SivOCeKaqIPf8weSOcfsqdJasESoj0Zt3H7uENee95KSSBOC1qBGw4UK_xiE4nKrZWHyEtw";

  function pushNotif() {
    // Check for service worker
    console.log("serviceWorker" in navigator);
    if ("serviceWorker" in navigator) {
      send().catch((err) => console.error(err));
    }
  }
  async function send() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("./worker.js", {
      scope: "/login-student",
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await httpService.post("/admin/test", subscription);
    // await fetch("/subscribe", {
    //   method: "POST",
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });
    console.log("Push Sent...");
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  return (
    <Container className="mt-5">
      <h2
        onClick={() => {
          // pushNotif();
        }}
        className="mb-4"
      >
        خوش آمدید
      </h2>
      <h4 className="mb-4"> ورود دانشجویان</h4>
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
      <Row className="custom-row-gap">
        <Link style={{ textDecoration: "none" }} to={"/add-student"}>
          ثبت نام
        </Link>
        <Link style={{ textDecoration: "none" }} to={"/reset-pass"}>
          رمز را فراموش کرده اید؟
        </Link>
        <Link
          style={{ textDecoration: "none", color: "orangered" }}
          to={"/login-teacher"}
        >
          <small> ورود کارمندان </small>
        </Link>
      </Row>
    </Container>
  );
};

export default LoginStudent;

import React, { useState } from "react";
import { useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { useNavigate } from "react-router-dom";

const ResetPass = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(1);
  const nav = useNavigate();
  useEffect(() => {
    let timer;
    if (showCodeInput && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (remainingTime === 0) {
      setResendButtonDisabled(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [showCodeInput, remainingTime]);

  async function sendCode() {
    let result = null;
    await tryHTTP(async () => {
      const { data } = await httpService.post("/student/send-code", {
        phoneNumber,
      });

      result = data;
    });

    return result;
  }
  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    const result = await sendCode();
    if (result) {
      setShowCodeInput(true);
      setRemainingTime(result.codeExpires * 60);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();

    tryHTTP(async () => {
      const { data } = await httpService.post("/student/reset-pass", {
        phoneNumber,
        code: verificationCode,
        password,
      });
      alert("رمز عبور با موفقیت عوض شد");
      nav("/");
    });
  };
  const handleResendCode = async () => {
    const result = await sendCode();
    if (result) {
      setResendButtonDisabled(true);
      setRemainingTime(result.codeExpires * 60);
    }
  };
  return (
    <div className="container">
      <h1 className="mb-4">تایید هویت</h1>
      {!showCodeInput ? (
        <Form onSubmit={handlePhoneNumberSubmit}>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>شماره موبایل </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Button className="mt-4" variant="primary" type="submit">
            ارسال کد
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleCodeSubmit}>
          <Form.Group controlId="formVerificationCode">
            <Form.Label>کد تایید</Form.Label>
            <Form.Control
              type="text"
              placeholder="####"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>رمز جدید </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Button
              variant="primary"
              className="w-50 m-auto mt-2 mb-2"
              type="submit"
            >
              تایید
            </Button>
          </Row>
          <Row>
            <Button
              className="w-50 m-auto mt-2 mb-2"
              variant="secondary"
              onClick={handleResendCode}
              disabled={resendButtonDisabled}
            >
              ارسال مجدد کد
            </Button>
          </Row>
          <Row>
            <p> زمان باقی مانده :{remainingTime}ثانیه </p>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default ResetPass;

import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { setToken } from "../Services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    tryHTTP(async () => {
      const { data } = await httpService.post("/admin/login", { password });
      setToken(data);
      window.location = "/students";
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-3">خوش آمدید</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>رمز</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-4 w-100" variant="primary" type="submit">
          ورود
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

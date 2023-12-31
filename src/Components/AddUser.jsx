import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { tryHTTP } from "./../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "./../Services/authService";
import { useNavigate } from "react-router-dom";
const AddUserForm = () => {
  const nav = useNavigate();
  const baseForm = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    studentCode: "",
  };
  const [formData, setFormData] = useState(baseForm);
  const [btnDisbled, setBtnDisabled] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  function addUser() {
    tryHTTP(
      async () => {
        setBtnDisabled(true);
        const { data } = await httpService.post("/student/sign-up", formData);
        alert("ثبت نام انجام شد");
        nav("/login-student");
        setFormData(baseForm);
      },
      () => {
        setBtnDisabled(false);
      }
    );
  }
  return (
    <Form className="add-user-form" onSubmit={handleSubmit}>
      <h1>ثبت نام</h1>
      <Form.Group controlId="firstName">
        <Form.Label>نام</Form.Label>
        <Form.Control
          type="text"
          //   placeholder="Enter first name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>نام خانوادگی</Form.Label>
        <Form.Control
          type="text"
          //   placeholder="Enter last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="studentCode">
        <Form.Label>شماره دانشجویی</Form.Label>
        <Form.Control
          type="text"
          name="studentCode"
          value={formData.studentCode}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="phoneNumber">
        <Form.Label>شماره تلفن</Form.Label>
        <Form.Control
          type="tel"
          //   placeholder="Enter phone number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label> رمز عبور</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button
        disabled={btnDisbled}
        className="mt-4"
        variant="primary"
        type="submit"
      >
        ثبت نام
      </Button>
    </Form>
  );
};

export default AddUserForm;

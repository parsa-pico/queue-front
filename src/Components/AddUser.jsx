import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { tryHTTP } from "./../Common/commonFuncs";
import httpService from "../Services/httpService";
import axios from "axios";
import { authHeader } from "./../Services/authService";
const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });

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
    tryHTTP(async () => {
      const { data } = await httpService.post(
        "/admin/sign-up-user",
        formData,
        authHeader
      );
      alert("ثبت نام انجام شد");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
      });
    });
  }
  return (
    <Form className="add-user-form" onSubmit={handleSubmit}>
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button className="mt-4" variant="primary" type="submit">
        اضافه کردن کاربر
      </Button>
    </Form>
  );
};

export default AddUserForm;

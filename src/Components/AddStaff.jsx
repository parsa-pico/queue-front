import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { useNavigate } from "react-router-dom";
const AddStaffForm = () => {
  const nav = useNavigate();
  const baseForm = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    isAdmin: false,
  };
  const [formData, setFormData] = useState(baseForm);
  const [btnDisbled, setBtnDisabled] = useState(false);
  const handleChange = (e) => {
    const { name, checked, type } = e.target;
    let { value } = e.target;
    if (type === "checkbox") value = checked;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData);
  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  function addUser() {
    tryHTTP(
      async () => {
        setBtnDisabled(true);
        await httpService.post("/admin/sign-up", formData, authHeader);
        alert("ثبت نام انجام شد");
        nav("/rooms");
        setFormData(baseForm);
      },
      () => {
        setBtnDisabled(false);
      }
    );
  }
  return (
    <Form className="add-user-form" onSubmit={handleSubmit}>
      <h1>ثبت نام کارمند جدید</h1>
      <Form.Group controlId="firstName">
        <Form.Label>نام</Form.Label>
        <Form.Control
          type="text"
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
      <Form.Check
        style={{ textAlign: "end" }}
        type="checkbox"
        className="mt-2 signup-checkbox"
        label="دسترسی ادمین"
        checked={formData.isAdmin}
        onChange={handleChange}
        name="isAdmin"
      />

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

export default AddStaffForm;

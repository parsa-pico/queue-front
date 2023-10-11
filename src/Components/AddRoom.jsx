import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { useLocation, useNavigate } from "react-router-dom";
const AddRoom = () => {
  const location = useLocation();
  const nav = useNavigate();
  const baseForm = {
    title: "",
    desc: "",
    floor: 1,
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
    addRoom();
  };

  function addRoom() {
    const { state } = location;
    const staffId = state._id;
    const form = { ...formData, staffId };
    tryHTTP(
      async () => {
        setBtnDisabled(true);
        const { data } = await httpService.post(
          "/admin/room",
          form,
          authHeader
        );
        alert("ثبت اتاق  انجام شد");
        nav("/staff");
        setFormData(baseForm);
      },
      () => {
        setBtnDisabled(false);
      }
    );
  }

  return (
    <Form className="add-user-form" onSubmit={handleSubmit}>
      <h1>ثبت اتاق جدید</h1>

      <MyFormGroup name="title" formData={formData} onChange={handleChange}>
        نام اتاق
      </MyFormGroup>
      <MyFormGroup
        name="floor"
        formData={formData}
        type="number"
        onChange={handleChange}
      >
        طبقه
      </MyFormGroup>
      <MyFormGroup name="desc" formData={formData} onChange={handleChange}>
        توضیحات (اختیاری)
      </MyFormGroup>

      <Button
        disabled={btnDisbled}
        className="mt-4"
        variant="primary"
        type="submit"
      >
        ثبت
      </Button>
    </Form>
  );
};

export default AddRoom;
function MyFormGroup({
  formData,
  children,
  name,
  onChange,
  type = "text",
  required = true,
  ...rest
}) {
  return (
    <Form.Group controlId={name}>
      <Form.Label>{children} </Form.Label>
      <Form.Control
        type={type}
        {...rest}
        name={name}
        value={formData[name]}
        onChange={onChange}
        required={required}
      />
    </Form.Group>
  );
}

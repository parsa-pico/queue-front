import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";

const UpdateCourse = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const [formData, setFormData] = useState({
    level: "",
    paymentAmount: "",
    isFinished: false,
    payedAmount: "",
    midTerm: "",
    final: "",
    extra: "",
    activity: "",
  });
  useEffect(() => {
    if (!loc.state) return;
    const { scores, payedAmount, paymentAmount, level, isFinished } = loc.state;
    const data = { payedAmount, paymentAmount, level, isFinished };
    for (let key in scores) {
      const d = scores[key];
      console.log(d, d === null);
      if (d !== null) data[key] = d;
    }

    setFormData({ ...formData, ...data });
  }, []);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    tryHTTP(async () => {
      const { midTerm, final, extra, activity, ...rest } = formData;
      e.preventDefault();
      const scores = {
        midTerm,
        final,
        extra,
        activity,
      };
      for (let key in scores) {
        const parsedScore = parseInt(scores[key], 10);
        scores[key] = isNaN(parsedScore) ? null : parsedScore;
      }
      const obj = { ...rest, scores, _id: loc.state.courseId };
      const { data } = await httpService.put("/admin/course", obj, authHeader);
      alert("تغییرات با موفقیت انجام شد");
      window.location = "/courses";
    });
  };

  return (
    <div style={{ margin: "0 2rem" }}>
      <h1 className="mb-3">تغییر دوره</h1>
      <h3>{loc.state && loc.state.firstName + " " + loc.state.lastName}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="level">
          <Form.Label>سطح</Form.Label>
          <Form.Control
            type="text"
            // placeholder="Enter level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="paymentAmount">
          <Form.Label>شهریه</Form.Label>
          <Form.Control
            type="text"
            // placeholder="Enter payment amount"
            name="paymentAmount"
            value={formData.paymentAmount}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="payedAmount">
          <Form.Label>پرداختی</Form.Label>
          <Form.Control
            type="text"
            // placeholder="Enter payed amount"
            name="payedAmount"
            value={formData.payedAmount}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="midTerm">
          <Form.Label>Midterm</Form.Label>
          <Form.Control
            type="number"
            // placeholder="Enter midterm score"
            name="midTerm"
            value={formData.midTerm}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="final">
          <Form.Label>Final</Form.Label>
          <Form.Control
            type="number"
            // placeholder="Enter final score"
            name="final"
            value={formData.final}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="extra">
          <Form.Label>Extra</Form.Label>
          <Form.Control
            type="number"
            // placeholder="Enter extra score"
            name="extra"
            value={formData.extra}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="activity">
          <Form.Label>Activity</Form.Label>
          <Form.Control
            type="number"
            // placeholder="Enter activity score"
            name="activity"
            value={formData.activity}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="isFinished">
          <Form.Check
            type="checkbox"
            label="دوره تمام شده؟"
            name="isFinished"
            checked={formData.isFinished}
            onChange={handleInputChange}
            className="mt-2"
            style={{
              textAlign: "start",
              marginLeft: "2rem",
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          ثبت
        </Button>
      </Form>
    </div>
  );
};

export default UpdateCourse;

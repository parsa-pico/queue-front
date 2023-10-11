import React, { useState, useEffect } from "react";
import { Form, Button, FormControl } from "react-bootstrap";
import { hasOptions, tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { useLocation, useNavigate } from "react-router-dom";

const AnswerForm = () => {
  const location = useLocation();
  const [form, setForm] = useState({});
  const nav = useNavigate();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const { state } = location;
    if (!state) {
      nav("/rooms");
      return;
    }
    const data = state;
    setForm(data);
    const obj = {};
    data.questions.forEach((q) => {
      obj[q._id] = hasOptions(q) ? [] : null;
    });
    setAnswers(obj);
  }, []);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type !== "checkbox")
      return setAnswers({
        ...answers,
        [name]: value,
      });
    const answer = [...answers[name]];
    if (checked) answer.push(value);
    else {
      const idx = answer.findIndex((a) => a === value);
      if (idx !== -1) answer.splice(idx, 1);
    }

    setAnswers({ ...answers, [name]: answer });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let key in answers) {
      const value = answers[key];
      console.log(value);
      const isArray = Array.isArray(value);
      if (isArray && value.length === 0)
        return alert("لطفا به همه سوالات جواب دهید");
      if (!isArray && (!value || !value.trim()))
        return alert("لطفا به همه سوالات جواب دهید");
    }
    tryHTTP(async () => {
      await httpService.post(
        "/student/form",
        { answers, head: { _id: form._id } },
        authHeader
      );
      console.log("Answers:", answers);
      alert("ممنون از مشارکت شما");
      nav("/rooms");
    });
  };

  return (
    <div className="p-4">
      {form.name && <h1 className="text-right">{form.name}</h1>}
      {form.descrption && <h2 className="text-right">{form.descrption}</h2>}
      <hr />
      <h3>سوالات</h3>
      <Form onSubmit={handleSubmit}>
        {form.questions &&
          form.questions.map((question, index) => {
            const hasOptionsRes = hasOptions(question);
            const name = question._id;
            return (
              <div key={index} className="mb-3">
                <Form.Label>{question.label}</Form.Label>
                {hasOptionsRes &&
                  question.options.map((option, i) => (
                    <Form.Check
                      style={{ textAlign: "start" }}
                      key={i}
                      type={question.type}
                      label={option}
                      name={name}
                      value={i}
                      onChange={handleInputChange}
                    />
                  ))}

                {!hasOptionsRes && (
                  <FormControl
                    required
                    type={question.type}
                    name={name}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            );
          })}
        <Button variant="primary" type="submit">
          ثبت
        </Button>
      </Form>
    </div>
  );
};

export default AnswerForm;

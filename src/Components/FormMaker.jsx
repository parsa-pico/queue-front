import React, { useState } from "react";
import { Form, Button, FormControl } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";

const FormMaker = () => {
  const [formFields, setFormFields] = useState([]);
  const [formHead, setFormHead] = useState({ name: "", description: "" });

  const [inputType, setInputType] = useState("text");
  const [inputLabel, setInputLabel] = useState("");
  const [numOptions, setNumOptions] = useState(1);
  const [checkboxOptions, setCheckboxOptions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setInputType(value);
    } else if (name === "label") {
      setInputLabel(value);
    } else if (name === "options" && value) {
      setNumOptions(parseInt(value, 10));
    }
  };

  const addField = () => {
    if (inputType && inputLabel) {
      const field = { type: inputType, label: inputLabel };
      if (["radio", "checkbox"].includes(inputType)) {
        field.options = checkboxOptions.slice(0, numOptions);
      }

      setFormFields([...formFields, field]);
      setInputLabel("");
      setCheckboxOptions([]);
      setNumOptions(1);
    }
  };
  console.log(formFields);
  const handleCheckboxOptionChange = (index, e) => {
    const newOptions = [...checkboxOptions];
    newOptions[index] = e.target.value;
    setCheckboxOptions(newOptions);
  };
  function submitForm() {
    tryHTTP(async () => {
      const result = await httpService.post(
        "/admin/make-form",
        { head: formHead, questions: formFields },
        authHeader
      );
      alert("سوالات ثبت شد");
    });
  }
  function handleHeadChange(e) {
    const { name, value } = e.target;
    setFormHead({ ...formHead, [name]: value });
  }
  return (
    <div className="p-4">
      <h1 className="text-right mb-2"> فرم جدید</h1>

      <Form.Group dir="rtl" controlId="fieldLabel">
        <Form.Label> نام فرم</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formHead.name}
          onChange={handleHeadChange}
        />
      </Form.Group>
      <Form.Group dir="rtl" controlId="fieldLabel">
        <Form.Label>توضیحات </Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formHead.description}
          onChange={handleHeadChange}
        />
      </Form.Group>
      <hr />
      <div className="text-right">
        <Form.Group controlId="fieldType">
          <Form.Label>:نوع سوال</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={inputType}
            onChange={handleInputChange}
            dir="rtl"
          >
            <option value="text">متن</option>
            {/* <option value="email">ایمیل</option> */}
            {/* <option value="number">عدد</option> */}
            <option value="checkbox">چک‌باکس</option>
            <option value="radio">رادیو</option>
          </Form.Control>
        </Form.Group>
      </div>
      <div className="text-right">
        <Form.Group controlId="fieldLabel">
          <Form.Label> سوال</Form.Label>
          <Form.Control
            type="text"
            name="label"
            value={inputLabel}
            onChange={handleInputChange}
            dir="rtl"
          />
        </Form.Group>
      </div>
      {(inputType === "checkbox" || inputType === "radio") && (
        <div className="text-right">
          <Form.Group controlId="numOptions">
            <Form.Label>:تعداد گزینه ها</Form.Label>
            <Form.Control
              type="number"
              name="options"
              value={numOptions}
              onChange={handleInputChange}
              dir="rtl"
              min="0"
              max="100"
              step="1"
            />
          </Form.Group>
          {[...Array(numOptions)].map((_, index) => (
            <div key={index} className="text-right">
              <Form.Group controlId={`checkboxOption${index}`}>
                <Form.Label>گزینه {index + 1}:</Form.Label>
                <Form.Control
                  type="text"
                  value={checkboxOptions[index] || ""}
                  onChange={(e) => handleCheckboxOptionChange(index, e)}
                  dir="rtl"
                />
              </Form.Group>
            </div>
          ))}
        </div>
      )}
      <div className="text-right mt-2">
        <Button variant="primary" onClick={addField}>
          افزودن سوال
        </Button>
      </div>
      <hr />
      <h2 className="text-right">پیش‌نمایش فرم</h2>

      <Form className="form-maker-preview">
        {formFields &&
          formFields.length !== 0 &&
          formFields.map((field, index) => (
            <div key={index} className="text-right mb-3 form-maker-item">
              <Form.Label htmlFor={field.label}>{field.label}</Form.Label>
              {(field.type === "checkbox" || field.type === "radio") &&
                field.options.map((option, i) => (
                  <Form.Check
                    style={{ textAlign: "start" }}
                    name={index}
                    key={i}
                    type={field.type}
                    label={option}
                  />
                ))}

              {!(field.type === "checkbox" || field.type === "radio") && (
                <Form.Control name={field.label} dir="rtl" type={field.type} />
              )}
            </div>
          ))}
      </Form>
      <Button onClick={submitForm}>ثبت فرم</Button>
    </div>
  );
};

export default FormMaker;

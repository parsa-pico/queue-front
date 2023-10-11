import React, { useState, useEffect } from "react";
import { downloadCSV, hasOptions, tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { Card, Button, Modal, Row, Col } from "react-bootstrap";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
const GetForms = () => {
  const nav = useNavigate();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    tryHTTP(async () => {
      const { data } = await httpService.get("/admin/forms", authHeader);
      console.log(data);
      setForms(data);
    });
  }, []);

  const handleFormClick = async (form) => {
    console.time("database");
    const { data } = await httpService.post(
      "/admin/form-details",
      { _id: form._id },
      authHeader
    );

    console.timeEnd("database");

    console.time("other");
    let questionsCopy = JSON.parse(JSON.stringify(form.questions));
    questionsCopy = questionsCopy.map((q) => ({ ...q, answers: {} }));
    data.forEach((element) => {
      const key = element.selectedAnswer;
      const value = element.totalCount;
      const obj = questionsCopy.find((q) => q._id === element._id);
      obj.answers[key] = value;
    });
    const formObj = { ...form, questions: questionsCopy };

    console.log(formObj);
    setSelectedForm(formObj);
    setShowModal(true);
    console.timeEnd("other");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };
  function handleChangeSwitch(checked) {
    if (checked) {
      const result = prompt(
        "در صورت روشن کردن فرم،بقیه فرم ها غیر فعال میشوند،اگر موافقید تایپ کنید 'فهمیدم'"
      );
      if (result !== "فهمیدم") return;
    }

    setSelectedForm({ ...selectedForm, isActive: checked });
    tryHTTP(
      async () => {
        await httpService.post(
          "/admin/active-form",
          { _id: selectedForm._id, checked },
          authHeader
        );

        window.location = "/get-forms";
      },
      null,
      () => {
        setSelectedForm({ ...selectedForm, isActive: !checked });
      }
    );
  }

  return (
    <div>
      <Button onClick={() => nav("/make-form")}>فرم جدید</Button>
      <h1>لیست فرم ها </h1>
      <div className="row">
        {forms.map((form) => (
          <div key={form._id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{form.name}</Card.Title>
                <Button variant="primary" onClick={() => handleFormClick(form)}>
                  مشاهده سوالات
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {selectedForm && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title dir="rtl">{selectedForm.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex-row">
              <Switch
                onChange={handleChangeSwitch}
                checked={selectedForm.isActive}
              />
              <p> :وضعیت فرم </p>
            </div>
            <h5 dir="rtl">سوالات</h5>
            {selectedForm.questions.map((question) => {
              const hasOptionsRes = hasOptions(question);
              let textAnswers = [question.label];
              if (!hasOptionsRes)
                textAnswers = [
                  textAnswers,
                  ...Object.keys(question.answers),
                ].join("\n");
              if (!hasOptionsRes) console.log(textAnswers);
              return (
                <div dir="rtl" key={question.label} className="m-5">
                  <strong> متن سوال :{question.label}</strong>
                  <p>نوع سوال: {question.type}</p>
                  {hasOptionsRes && (
                    <div>
                      <p>گزینه ها</p>
                      {question.options.map((opt, idx) => {
                        return (
                          <div key={idx} className="get-form-options">
                            <p style={{ paddingLeft: "1rem" }}>{opt}</p>
                            <p>تکرار :{question.answers[idx] || 0}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!hasOptionsRes && (
                    <>
                      <Button
                        onClick={() => downloadCSV(textAnswers, "soal.txt")}
                      >
                        دانلود جواب ها
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
export default GetForms;

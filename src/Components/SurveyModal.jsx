import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SurveyModal = ({ show, setShow, handleYesClick }) => {
  const nav = useNavigate();

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title dir="rtl">مشارکت در نظرسنجی</Modal.Title>
      </Modal.Header>
      <Modal.Body dir="rtl">آیا می‌خواهید در نظرسنجی شرکت کنید؟</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          خیر
        </Button>
        <Button variant="primary" onClick={handleYesClick}>
          بله
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SurveyModal;

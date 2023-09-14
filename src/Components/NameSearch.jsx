import React from "react";
import { Button, Row } from "react-bootstrap";
import { Input } from "./../Common/Inputs";
import { Col } from "react-bootstrap";

export default function NameSearch({
  name,
  fChange: handleFirstNameChange,
  lChange: handleLastNameChange,
  search,
}) {
  return (
    <div>
      <Row style={{ direction: "rtl", padding: "0 0.5rem" }}>
        <Col>
          <Input
            placeholder={"نام"}
            value={name.firstName}
            onChange={handleFirstNameChange}
          />
        </Col>
        <Col>
          <Input
            placeholder={"نام خانوادگی "}
            value={name.lastName}
            onChange={handleLastNameChange}
          />
        </Col>
      </Row>
      <Button onClick={search} className="mt-2 mb-2">
        جستجو
      </Button>
    </div>
  );
}

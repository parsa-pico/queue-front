import React, { useEffect, useState } from "react";
import { Button, ListGroup, Row, Col } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import NameSearch from "./NameSearch";

const Staff = () => {
  const [users, setUsers] = useState([{}]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleItemClick = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const nav = useNavigate();
  const FirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const LastNameChange = (e) => {
    setLastName(e.target.value);
  };
  function search() {
    tryHTTP(async () => {
      const { data } = await httpService.get("/admin/staff", {
        ...authHeader,
        params: { firstName, lastName },
      });
      console.log(data);
      setUsers(data);
    });
  }
  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <h1 className="mb-4">کارمندان</h1>
      <Button
        onClick={() => {
          nav("/add-staff");
        }}
        className="mb-3 ml-auto"
      >
        کارمند جدید
      </Button>
      <NameSearch
        fChange={FirstNameChange}
        lChange={LastNameChange}
        search={search}
        name={{ firstName, lastName }}
      />

      <ListGroup>
        {users.length !== 0 &&
          users.map((contact, index) => (
            <ListGroup.Item
              onClick={() => handleItemClick(index)}
              active={index === expandedIndex}
              style={{ cursor: "pointer" }}
              key={index}
            >
              <div>
                <strong>نام:</strong> {contact.firstName} {contact.lastName}
              </div>
              <div>
                <strong>تلفن:</strong> {contact.phoneNumber}
              </div>
              {index === expandedIndex && (
                <Row>
                  <Col>
                    <Button
                      onClick={() => {
                        nav("/rooms-admin", {
                          state: contact,
                        });
                      }}
                      variant="warning"
                    >
                      اتاق ها{" "}
                    </Button>
                  </Col>
                  {/* <Col>
                    <Button
                      onClick={() => {
                        nav("/add-course", { state: contact });
                      }}
                      variant="success"
                    >
                      اتاق جدید
                    </Button>
                  </Col> */}
                </Row>
              )}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default Staff;

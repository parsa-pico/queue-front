import React, { useEffect, useState } from "react";
import { Button, ListGroup, Row, Col } from "react-bootstrap";
import { tryHTTP } from "../Common/commonFuncs";
import httpService from "../Services/httpService";
import { authHeader } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import NameSearch from "./NameSearch";

const Users = () => {
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
      const { data } = await httpService.get("/admin/users", {
        ...authHeader,
        params: { firstName, lastName },
      });

      setUsers(data);
    });
  }
  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <h1 className="mb-4">کاربران</h1>
      <Button
        onClick={() => {
          nav("/add-student");
        }}
        className="mb-3 ml-auto"
      >
        کاربر جدید
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
                        nav("/courses", {
                          state: {
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                          },
                        });
                      }}
                      variant="warning"
                    >
                      دوره ها{" "}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        nav("/add-course", { state: contact });
                      }}
                      variant="success"
                    >
                      دوره جدید
                    </Button>
                  </Col>
                </Row>
              )}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default Users;

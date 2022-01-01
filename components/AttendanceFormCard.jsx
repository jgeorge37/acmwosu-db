import React, { useState, useEffect, useRef } from 'react';
import {validateName, validateLastNameDotNum} from '../utility/validate_util';
import { getMeetingIdByCode, recordAttendance } from '../utility/api_util';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const AttendanceFormCard = (props) => {
  const eventCode = useRef("");
  const firstName = useRef("");
  const lastNameDotNum = useRef("");
  const year = useRef(1);
  const listServ = useRef(0);
  const [failureMessage, setFailureMessage] = useState("");
  const subscribed = useRef(false);

  // prevent async update if unmounted
  useEffect(() => {return () => {subscribed.current = false}}, []);

  const processAttendance = async() => {
    const meetingId = await getMeetingIdByCode(eventCode.current);
    const studentObj = {
      last_name_dot_num: lastNameDotNum.current,
      first_name: firstName.current,
      school_level: year.current,
      add_to_newsletter: listServ.current
    }
    await recordAttendance(meetingId, studentObj);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    
    if (!eventCode.current) {
      setFailureMessage("Event code cannot be empty.")
    } else if (!validateName(firstName.current)) {
      setFailureMessage("Invalid first name.");
    } else if (!validateLastNameDotNum(lastNameDotNum.current)) {
      setFailureMessage("Invalid last name dot number.");
    } else {
      setFailureMessage("");
      subscribed.current = true;
      processAttendance().then(
        () => {if (subscribed.current) props.setSuccess(true);}
      ).catch((err) => {
        setFailureMessage("Error: " + err.message);
      }).finally(() => {});
    }
  }

  const handleChange = (event, ref) => {
    event.preventDefault();
    ref.current = event.target.value;
  }

  return <div>
    <Card id="att-form">
      <Card.Img className="sponsor-logos" variant="top" src="/sponsor_logos.PNG" />
      <Card.Body>
        <Form onSubmit={(event) => onSubmit(event)}>
          <Form.Group className="mb-3" controlId="formEventCode">
            <Form.Label>Event code</Form.Label>
            <Form.Control
            type="text"
            placeholder="00000"
            onChange={(e) => handleChange(e, eventCode)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Brutus"
            onChange={(e) => handleChange(e, firstName)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>Last Name.#</Form.Label>
            <Form.Control
            type="text"
            placeholder="Buckeye.1"
            onChange={(e) => handleChange(e, lastNameDotNum)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formYear">
            <Form.Label>What year of school are you in?</Form.Label>
            <Form.Select onChange={(e) => handleChange(e, year)}>
              <option value={1}>First</option>
              <option value={2}>Second</option>
              <option value={3}>Third</option>
              <option value={4}>Fourth</option>
              <option value={5}>Fifth+</option>
              <option value={6}>Graduate student</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formYear">
            <Form.Label>Would you like to be added to the mailing list for our weekly newsletter?</Form.Label>
            <Form.Select onChange={(e) => handleChange(e, listServ)}>
              <option value={0}>I'm already on it</option>
              <option value={1}>Yes, please</option>
              <option value={2}>Nope, thank you</option>
            </Form.Select>
          </Form.Group>

          <Form.Text className="field-error">
              {failureMessage}
          </Form.Text>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
    <style jsx="true">{`
      #att-form {
        max-width: 600px;
        margin: auto;
        color: black;
      }
      .sponsor-logos {
        width: auto;
        max-width: 80%;
        height: auto;
        max-height: 400px;
        margin: auto;
      }
      .field-error {
        color: red;
        display: block;
        margin-bottom: 5px;
      }
    `}</style>
  </div>
}

export default AttendanceFormCard;

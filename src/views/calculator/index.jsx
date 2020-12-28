import React from 'react';
import {
  Card,
  Form,
  Button,
  Col,
  Row,
  Container,
  Table,
} from 'react-bootstrap';
import { VscChromeClose as RemoveIcon } from 'react-icons/vsc';

const Calculator = () => {
  return (
    <Container>
      <Card className="mt-4 calculator">
        <Card.Header className="bg-primary text-white">Calculator</Card.Header>
        <Card.Body className="bg-light-sky-blue">
          <Form>
            <Row>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="text-sky-blue">
                    Select Product
                  </Form.Label>
                  <Form.Control as="select" className="text-dark-blue">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="text-sky-blue">Select Date</Form.Label>
                  <Form.Control type="date" className="text-dark-blue" />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <div className="text-sky-blue d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="text-sky-blue mb-0">
                      Locations
                    </Form.Label>
                    <Button variant="success" className="px-4" size="sm">
                      Add
                    </Button>
                  </div>
                  <Table bordered responsive size="sm">
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Units</th>
                        <th>Cost</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ashoke</td>
                        <td>2000</td>
                        <td>5000.00</td>
                        <td>
                          <span className="border border-danger rounded d-inline-flex p-1 cursor-pointer delete-icon">
                            <RemoveIcon className="text-danger" />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Ashoke</td>
                        <td>2000</td>
                        <td>5000.00</td>
                        <td>
                          <span className="border border-danger rounded d-inline-flex p-1 cursor-pointer delete-icon">
                            <RemoveIcon className="text-danger" />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Form.Group>
              </Col>
              <Col xs={12} sm={4}>
                <Form.Group>
                  <Form.Label className="mr-2 text-sky-blue">
                    Total Units:
                  </Form.Label>
                  <span className="text-dark-blue">2000</span>
                </Form.Group>
              </Col>
              <Col xs={12} sm={8}>
                <Form.Group>
                  <Form.Label className="mr-2 text-sky-blue">
                    Total Cost:
                  </Form.Label>
                  <span className="text-dark-blue">5000.00</span>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" className="px-5 calculator-submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Calculator;

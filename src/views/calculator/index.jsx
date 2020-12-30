import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Col,
  Row,
  Container,
  Table,
  Modal,
} from 'react-bootstrap';
import { RiDeleteBin6Line as RemoveIcon } from 'react-icons/ri';
import { httpGet } from '../../utils/https';
import URLS from '../../utils/urls';
import Map from '../../components/map';
import DatePicker from 'react-datepicker';
import { useStateCallback } from '../../utils/helpers';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');

const DATE_CONFIG = {
  START_DATE: new Date(moment().add(1, 'days').format()),
  END_DATE: new Date(moment().add(7, 'days').format()),
};

const Calculator = () => {
  const state = {
    date: DATE_CONFIG.START_DATE,
    product: {},
    isValidate: false,
    locations: [],
  };
  const [formData, setFormData] = useState(state);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isSubmit] = useStateCallback(false);

  const openMap = () => {
    if (!formData.product || Object.keys(formData.product).length === 0) {
      alert('Please select product first');
      return;
    }
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  useEffect(() => {
    const product_url = URLS.PRODUCT.PRODUCTS;
    httpGet(product_url, { trace_name: 'get_products' }).then((res) => {
      setProducts(res);
    });

    const location_url = URLS.LOCATION.LOCATIONS;
    httpGet(location_url, { trace_name: 'get_locations' }).then((res) => {
      setLocations(res);
    });
  }, []);

  const calculateMaxProductions = () => {
    const start_date = moment(DATE_CONFIG.START_DATE, 'M/D/YYYY');
    const selected_date = moment(formData.date, 'M/D/YYYY');
    const selected_day = selected_date.diff(start_date, 'days') + 1;
    let max_production = 0;
    if (formData.product?.max_production) {
      const { max_production: production } = formData.product;
      if (production[selected_day] !== undefined) {
        max_production = production[selected_day];
      } else {
        max_production = production[Object.keys(production).length] || 0;
      }
    }
    return max_production;
  };

  const calculateLocationFormData = (location) => {
    const max_production = calculateMaxProductions();
    let max_dist = 0;
    max_dist = [...formData.locations, location]
      .map((loc) => loc.max_dist)
      .reduce((prev, current) => prev + current);

    if (max_dist > max_production) {
      alert(`You can distribute maximum ${max_production} item(units)`);
      return formData.locations;
    }
    return [...formData.locations, location];
  };

  const addLocation = (location) => {
    const calculatedData = calculateLocationFormData(location);
    setFormData({ ...formData, locations: calculatedData });
    closeMap();
  };

  const selectDate = (date) => {
    setFormData({ ...formData, date });
  };

  const selectProduct = (e) => {
    const product = products.find(({ id }) => id === e.target.value) || {};
    setFormData({ ...formData, product });
  };

  const deleteLocation = (id) => {
    const locations = formData.locations.filter((loc) => loc.id !== id);
    setFormData({ ...formData, locations });
  };

  const checkValidations = () => {
    const errorStructure = {
      errorDate: '',
      errorProduct: '',
    };
    if (!isSubmit) return errorStructure;
    if (!formData.product || Object.keys(formData.product).length === 0) {
      errorStructure.errorProduct = 'Please select product';
    }
    if (!formData.date) {
      errorStructure.errorDate = 'Please select date';
    }
    if (!errorStructure.errorProduct && !errorStructure.errorDate) {
      formData.isValidate = true;
    } else {
      formData.isValidate = false;
    }
    return errorStructure;
  };

  const { errorDate, errorProduct } = checkValidations();

  return (
    <>
      <Container>
        <Card className="mt-4 calculator">
          <Card.Header className="bg-primary text-white">
            Calculator
          </Card.Header>
          <Card.Body className="bg-light-sky-blue">
            <Form>
              <Row>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="text-sky-blue">
                      Select Product
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="product"
                      className="text-dark-blue"
                      onChange={selectProduct}
                      value={formData.product?.id}
                    >
                      <option value="">Select Product</option>
                      {products.length > 0 &&
                        products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </Form.Control>
                    {errorProduct && (
                      <Form.Text className="text-danger">
                        {errorProduct}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="text-sky-blue">
                      Select Date
                    </Form.Label>
                    <div>
                      <DatePicker
                        onChange={(date) => selectDate(date)}
                        selected={formData.date}
                        minDate={DATE_CONFIG.START_DATE}
                        maxDate={DATE_CONFIG.END_DATE}
                        locale="es"
                        className="text-dark-blue"
                      />
                    </div>
                    {errorDate && <div>{errorDate}</div>}
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <div className="text-sky-blue d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="text-sky-blue mb-0">
                        Locations
                      </Form.Label>
                      <Button
                        variant="success"
                        className="px-4"
                        size="sm"
                        onClick={openMap}
                      >
                        Add
                      </Button>
                    </div>
                    <Table
                      bordered
                      responsive
                      size="sm"
                      className="calculator-table"
                    >
                      <thead>
                        <tr>
                          <th className="place">Place</th>
                          <th className="units table-min-80">Units</th>
                          <th className="cost table-min-80">Cost</th>
                          <th className="actions text-center table-min-80">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.locations && formData.locations.length > 0 ? (
                          formData.locations.map((loc) => (
                            <tr key={loc.id}>
                              <td className="place">{loc.name}</td>
                              <td className="units table-min-80">
                                <Form.Control
                                  type="text"
                                  value={loc.max_dist}
                                  size="sm"
                                />
                              </td>
                              <td className="cost table-min-80">
                                <span>
                                  {loc.fee +
                                    (loc.max_dist *
                                      formData.product?.price_per_unit || 0)}
                                </span>
                              </td>
                              <td className="actions text-center table-min-80">
                                <span className="border border-danger rounded d-inline-flex p-1 cursor-pointer delete-icon">
                                  <RemoveIcon
                                    className="text-danger"
                                    onClick={() => deleteLocation(loc.id)}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-2 font-14"
                            >
                              No location added
                            </td>
                          </tr>
                        )}
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
      <Modal show={showMap} size="xl" onHide={closeMap}>
        <Map
          isMarkerShown={true}
          data={locations}
          addedLocations={formData.locations}
          addLocation={addLocation}
        />
      </Modal>
    </>
  );
};

export default Calculator;

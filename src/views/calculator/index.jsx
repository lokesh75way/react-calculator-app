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
import { httpGet, httpPost } from '../../utils/https';
import URLS from '../../utils/urls';
import Map from '../../components/map';
import DatePicker from 'react-datepicker';
import { useStateCallback } from '../../utils/helpers';
import { showErrorMsg, showSuccessMsg } from '../../utils/notifications';
import { CALENDER_CONFIG } from '../../config/constants';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

const moment = require('moment');

const Calculator = () => {
  const state = {
    date: '',
    product: {},
    isValidate: false,
    locations: [],
    isLoading: false,
  };
  const [formData, setFormData] = useState(state);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isSubmit, setIsSubmit] = useStateCallback(false);
  const [formattedLocations, setFormattedLocations] = useState([]);

  const formatLocations = (data = []) => {
    const locationLatLongs = [];
    const formattedData = [];
    if (data.length > 0) {
      data.forEach((locData) => {
        if (!locationLatLongs.includes(`${locData.lat}-${locData.long}`)) {
          locationLatLongs.push(`${locData.lat}-${locData.long}`);
          const getData = data.filter(
            (loc) => loc.lat === locData.lat && loc.long === locData.long
          );
          formattedData.push({ [`${locData.lat}-${locData.long}`]: getData });
        }
      });
    }
    setFormattedLocations(formattedData);
  };

  const openMap = () => {
    if (locations && locations.length === 0) {
      const location_url = URLS.LOCATION.LOCATIONS;
      httpGet(location_url, { trace_name: 'get_locations' }).then((res) => {
        setLocations(res);
        formatLocations(res);
      });
    }

    if (!formData.product || Object.keys(formData.product).length === 0) {
      showErrorMsg('Please select product first');
      return;
    }
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  useEffect(() => {
    const productUrl = URLS.PRODUCT.PRODUCTS;
    httpGet(productUrl, { trace_name: 'get_products' }).then((res) => {
      setProducts(res);
    });
  }, []);

  const calculateMaxProductions = () => {
    const startDate = moment(
      moment(CALENDER_CONFIG.START_DATE).format('DD.MM.YYYY'),
      'DD.MM.YYYY'
    );
    const selectedDate = moment(
      moment(formData.date).format('DD.MM.YYYY'),
      'DD.MM.YYYY'
    );
    const selectedDay = selectedDate.diff(startDate, 'days') + 1;
    let maxProduction = 0;
    if (formData.product?.max_production) {
      const { max_production: production } = formData.product;
      if (production[selectedDay] !== undefined) {
        maxProduction = production[selectedDay];
      } else {
        maxProduction = production[Object.keys(production).length] || 0;
      }
    }
    return maxProduction;
  };

  const calculateLocationFormData = (location) => {
    const maxProduction = calculateMaxProductions();
    let maxDist = 0;
    const totalUnits = getTotalUnits();
    maxDist = totalUnits + location?.max_dist || 0;
    if (maxDist > maxProduction) {
      showErrorMsg(
        `You can distribute maximum ${maxProduction} items(units) on ${moment(
          formData.date
        ).format('DD-MMM-YY')}`
      );
      return formData.locations;
    }
    return [...formData.locations, location];
  };

  const getTotalUnits = () => {
    let totalUnits = 0;
    if (formData.locations.length > 0 && formData.locations.length > 0) {
      formData.locations.forEach((loc) => {
        totalUnits = totalUnits + Number(loc.max_dist);
      });
    }
    return totalUnits;
  };

  const getTotalCost = () => {
    let totalCost = 0;
    if (formData.locations.length > 0 && formData.locations.length > 0) {
      formData.locations.forEach((loc) => {
        totalCost =
          totalCost +
          Number((loc.max_dist > 0 && loc.fee) || 0) +
          Number(loc.max_dist) * Number(formData.product?.price_per_unit || 0);
      });
    }
    return totalCost;
  };

  const addLocation = (location) => {
    const calculatedData = calculateLocationFormData(location);
    setFormData({ ...formData, locations: calculatedData });
    closeMap();
  };

  const handleLocationUnits = (e, id) => {
    const selectedLocations = [...formData.locations];
    const locationIndex = selectedLocations.findIndex((loc) => loc.id === id);
    const getLocation = locations.find((loc) => loc.id === id);
    if (e.target.value > getLocation.max_dist) {
      showErrorMsg(
        `You can select maximum ${getLocation.max_dist} items(units) for ${getLocation.name} place`
      );
      return;
    }
    const updatedUnit = {
      ...selectedLocations[locationIndex],
      max_dist: !e.target.value || e.target.value < 0 ? 0 : e.target.value,
    };
    selectedLocations[locationIndex] = updatedUnit;
    setFormData({ ...formData, locations: selectedLocations });
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
      errorMaxProduction: '',
      errorLocation: '',
    };
    const maxProduction = calculateMaxProductions();
    const totalUnits = getTotalUnits();
    if (totalUnits > maxProduction) {
      errorStructure.errorMaxProduction = `You can distribute maximum ${maxProduction} items(units) on ${moment(
        formData.date
      ).format('DD-MMM-YYYY')}`;
    }

    if (!isSubmit) return errorStructure;
    if (!formData.product || Object.keys(formData.product).length === 0) {
      errorStructure.errorProduct = 'Please select product';
    }
    if (!formData.date) {
      errorStructure.errorDate = 'Please select date';
    }
    if (formData.locations.length === 0) {
      errorStructure.errorLocation = 'Please select at lease one location';
    }
    if (
      !errorStructure.errorProduct &&
      !errorStructure.errorDate &&
      !errorStructure.errorMaxProduction &&
      !errorStructure.errorLocation
    ) {
      formData.isValidate = true;
    } else {
      formData.isValidate = false;
    }
    return errorStructure;
  };

  const formSubmit = () => {
    setIsSubmit({ isSubmit: true }, (stateData) => {
      if (stateData.isSubmit) {
        const { isValidate } = formData;
        if (!isValidate) return;
        const date = moment(formData.date).format('YYYY-MM-DD');
        const product = Number(formData.product.id);
        const locations = formData.locations
          .map((loc) => ({
            id: Number(loc.id),
            quantity: Number(loc.max_dist),
          }))
          .filter((data) => Boolean(data.quantity));
        const params = {
          date,
          product,
          locations,
        };
        const cartUrl = URLS.CART.ADD_CART;
        setFormData({ ...formData, isLoading: true });
        httpPost(cartUrl, params, { trace_name: 'add_cart' }).then(
          (res) => {
            if (res && res.status === 'success') {
              showSuccessMsg('Data added successfuly');
              setFormData(state);
              setIsSubmit(false);
            } else {
              showErrorMsg(res.status);
              setFormData({ ...formData, isLoading: true });
            }
          },
          (err) => {
            setFormData({ ...formData, isLoading: true });
          }
        );
      }
    });
  };

  const {
    errorDate,
    errorProduct,
    errorMaxProduction,
    errorLocation,
  } = checkValidations();
  const totalUnits = getTotalUnits();
  const totalCost = getTotalCost();

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
                      value={formData.product?.id || ''}
                    >
                      <option value="" disabled={formData.locations.length > 0}>
                        Select Product
                      </option>
                      {products.length > 0 &&
                        products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </Form.Control>
                    {errorProduct && (
                      <div className="text-danger font-12">{errorProduct}</div>
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
                        popperPlacement="top-end"
                        placeholderText="Select Date"
                        onChange={(date) => selectDate(date)}
                        selected={formData.date}
                        minDate={CALENDER_CONFIG.START_DATE}
                        maxDate={CALENDER_CONFIG.END_DATE}
                        locale="es"
                        className="text-dark-blue"
                      />
                    </div>
                    {errorDate && (
                      <div className="text-danger font-12">{errorDate}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <div className="text-sky-blue d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="text-sky-blue mb-0">
                        Select Locations
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
                                  type="number"
                                  value={loc.max_dist}
                                  size="sm"
                                  onChange={(e) =>
                                    handleLocationUnits(e, loc.id)
                                  }
                                />
                              </td>
                              <td className="cost table-min-80">
                                <span>
                                  {((loc.max_dist > 0 && loc.fee) || 0) +
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
                    {errorMaxProduction && (
                      <div className="text-danger font-12">
                        {errorMaxProduction}
                      </div>
                    )}
                    {errorLocation && (
                      <div className="text-danger font-12">{errorLocation}</div>
                    )}
                  </Form.Group>
                </Col>
                {((formData.locations && formData.locations.length > 0) ||
                  Boolean(totalUnits) ||
                  Boolean(totalCost)) && (
                  <>
                    <Col xs={12} sm={4}>
                      <Form.Group>
                        <Form.Label className="mr-2 text-sky-blue">
                          Total Units:
                        </Form.Label>
                        <span className="text-dark-blue">{totalUnits}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={8}>
                      <Form.Group>
                        <Form.Label className="mr-2 text-sky-blue">
                          Total Cost:
                        </Form.Label>
                        <span className="text-dark-blue">{totalCost}</span>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>
              <Button
                variant="primary"
                className="px-5 calculator-submit"
                onClick={formSubmit}
                disabled={
                  formData.isLoading ||
                  (isSubmit && !formData.isValidate) ||
                  errorMaxProduction ||
                  totalUnits === 0
                }
              >
                {formData.isLoading ? 'Loading...' : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Modal show={showMap} size="xl" onHide={closeMap} className="map-modal">
        <Map
          isMarkerShown={true}
          data={locations}
          formattedLocations={formattedLocations}
          addedLocations={formData.locations}
          addLocation={addLocation}
          closeMap={closeMap}
        />
      </Modal>
    </>
  );
};

export default Calculator;

import { CALENDER_CONFIG } from '../../config/constants';
import { showErrorMsg } from '../../utils/notifications';

const moment = require('moment');

/**
 * FORMAT LOCATIONS ACCORDING TO GROUP BY STRUCTURE
 *
 * @param {Array} data
 * @returns {Array}
 */
export const formatLocations = (data = []) => {
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

  return formattedData;
};

/**
 * CALCULATE MAXIMUM PRODUCTIONS ON A SELECTED DATE
 *
 * @param {Object} formData
 * @returns {Number}
 */
export const calculateMaxProductions = (formData = {}) => {
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

/**
 * CALCULATE TOTAL UNITS
 *
 * @param {Object} formData
 * @returns {Number}
 */
export const calculateTotalUnits = (formData = {}) => {
  let totalUnits = 0;
  if (formData.locations.length > 0 && formData.locations.length > 0) {
    formData.locations.forEach((loc) => {
      totalUnits = totalUnits + Number(loc.max_dist);
    });
  }
  return totalUnits;
};

/**
 * CALCULATE TOTAL COSTS
 *
 * @param {Object} formData
 * @returns {Number}
 */
export const calculateTotalCost = (formData = {}) => {
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

/**
 * CALCULATE LOCATIONS DATA
 *
 * @param {Object} location
 * @param {Object} formData
 * @returns {Array}
 */
export const calculateLocationFormData = (location = {}, formData = {}) => {
  const maxProduction = calculateMaxProductions(formData);
  let maxDist = 0;
  const totalUnits = calculateTotalUnits(formData);
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

const API_URL = process.env.REACT_APP_API_URL;

const URLS = {
  PRODUCT: {
    PRODUCTS: `${API_URL}/products`,
  },
  LOCATION: {
    LOCATIONS: `${API_URL}/locations`,
  },
  CART: {
    ADD_CART: `${API_URL}/cart`,
  },
};

export default URLS;

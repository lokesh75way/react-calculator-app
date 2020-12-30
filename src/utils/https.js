import axios from 'axios';
import { MESSAGES } from '../configs/constants';

/**
 * CANCEL TOKEN
 */
const { CancelToken } = axios;

/**
 * USED TO CANCEL HTTP REQUEST
 */
let cancelHttpTokens = [];

/**
 * HELPER PARAM USED IN REQUEST
 */
const HELPER_PARAMS = {
  callback: null, // Function|Null
  headers: {}, // Additional Headers
  trace_name: 'untraced_event',
};

/**
 * THIS FUNCTION RETURNS THE COMMON HEADER
 *
 * @param {String} url
 * @param {Object} additional_headers
 *
 * @return {Object} Headers
 */
export const getCommonHeaders = (url, additional_headers = {}) => {
  try {
    const token = '';
    const { trace_name } = additional_headers;
    const light_step_headers = {
      'x-api-trace-name': trace_name,
    };
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${token}`,
      ...light_step_headers,
      ...additional_headers,
    };
    return headers;
  } catch (e) {
    return {};
  }
};

/**
 * THIS FUNCTION IS USED TO EXTRACT COMMON JSON RESPONSE
 *
 * @param {JSON} json [JSON DATA]
 *
 * @return {Object|String} EXTRACTED VALUE OR BLANK OBJECT
 */
export const extractJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return '';
  }
};

/**
 * THIS FUNCTION HANDLES COMMON SUCCESS REPONSE
 *
 * @param {Object|Null} res
 *
 * @return {Object|Null}
 */
export const httpHandleResponse = (res) => {
  cancelHttpTokens = [];
  if (!res) return Promise.reject(null);

  const r = res.data;
  return Promise.resolve(r);
};

/**
 * THIS FUNCTION IS USED TO HANDLE COMMON API ERROR RESPONSE
 *
 * @param {Object|Null} error
 *
 * @return {Object|String|Null}
 */
export const httpHandleError = (error) => {
  /* error = { error, config, code, request, response } */
  try {
    if (!error) return Promise.reject({});

    /* Handle Cancel Request */
    cancelHttpTokens = [];
    if (!error.request) return Promise.reject('cancelled');

    const xhr = error.request;

    let err = {};
    if (xhr.response) err = extractJSON(xhr.response);

    if (xhr) {
      switch (xhr.status) {
        case 0:
          alert(MESSAGES.SERVER_ERROR);
          break;

        case 400:
          if (err.error) {
            alert(err.error[0].message);
          } else if (!err.status && !err.error && err.response) {
            alert(err.response);
          } else {
            alert(MESSAGES.INTERNAL_ERROR);
          }
          break;

        case 401:
          alert(xhr.statusText);
          break;

        case 403:
          alert('You do not have access.');
          break;

        case 404:
          alert(err.response);
          break;

        case 412:
          if (Object.keys(err.errors)[0] === 'q') {
            alert('Please enter valid location.');
          } else {
            alert(err.errors[Object.keys(err.errors)[0]][0]);
          }
          break;

        case 422:
          if (err.errors && err.errors[0] && err.errors[0].detail) {
            alert(err.errors[0].detail);
          } else if (Array.isArray(err.message)) {
            alert(err.message[0]);
          } else if (err.message) {
            alert(err.message);
          } else if (err.error && typeof err.error == 'string') {
            alert(err.error);
          } else {
            alert(err[Object.keys(err)[0]]);
          }
          break;

        case 502:
          alert(MESSAGES.BAD_GATEWAY);
          break;

        case 503:
          if (err.error && typeof err.error == 'string') {
            alert(err.error);
          } else {
            alert(MESSAGES.BAD_GATEWAY);
          }
          break;

        default:
          alert(MESSAGES.INTERNAL_ERROR);
      }
    } else {
      alert(MESSAGES.INTERNAL_ERROR);
    }

    return Promise.reject(err);
  } catch (e) {
    console.error('-- HTTP HANDLE ERROR -- ', e);
    return Promise.reject({});
  }
};

/**
 * THIS COMMON FUNCTION IS USED TO CALL API REQUEST WHOSE REQUEST_METHOD=GET
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpGet = async (
  url,
  { callback, headers, trace_name } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);
    if (!trace_name) ({ trace_name } = HELPER_PARAMS);
    headers.trace_name = trace_name;

    return axios
      .get(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken((c) => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then((res) => {
        return httpHandleResponse(res);
      })
      .catch((err) => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error('-- HTTP GET -- ', e);
    return Promise.reject({});
  }
};

/**
 * THIS COMMON FUNCTION IS USED TO CALL API REQUEST WHOSE REQUEST_METHOD=POST
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPost = (
  url,
  params,
  { callback, headers, trace_name } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);
    if (!trace_name) ({ trace_name } = HELPER_PARAMS);
    headers.trace_name = trace_name;

    return axios
      .post(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken((c) => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then((res) => {
        return httpHandleResponse(res);
      })
      .catch((err) => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error('-- HTTP POST -- ', e);
    return Promise.reject({});
  }
};

/**
 * THIS COMMON FUNCTION IS USED TO CALL API REQUEST WHOSE REQUEST_METHOD=PUT
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPut = (
  url,
  params,
  { callback, headers, trace_name } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);
    if (!trace_name) ({ trace_name } = HELPER_PARAMS);
    headers.trace_name = trace_name;

    return axios
      .put(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken((c) => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then((res) => {
        return httpHandleResponse(res);
      })
      .catch((err) => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error('-- HTTP PUT -- ', e);
    return Promise.reject({});
  }
};

/**
 * THIS COMMON FUNCTION IS USED TO CALL API REQUEST WHOSE REQUEST_METHOD=DELETE
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpDelete = (
  url,
  { callback, headers, trace_name } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);
    if (!trace_name) ({ trace_name } = HELPER_PARAMS);
    headers.trace_name = trace_name;

    return axios
      .delete(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken((c) => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then((res) => {
        return httpHandleResponse(res);
      })
      .catch((err) => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.error('-- HTTP DELETE -- ', e);
    return Promise.reject({});
  }
};

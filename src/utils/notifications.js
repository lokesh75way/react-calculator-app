import { MESSAGES } from '../configs/constants';

/**
 * COMMON FUNCTION TO DISPLAY SUCCESS MESSAGE IN SNACKBAR
 *
 * @param {String} message [message to show]
 */
export const showSuccessMsg = (msg) => {
  showNotification(msg, 'success');
};

/**
 * COMMON FUNCTION TO DISPLAY ERROR MESSAGE IN SNACKBAR
 *
 * @param {String} message [message to show]
 */
export const showErrorMsg = (msg) => {
  showNotification(msg, 'error');
};

/**
 * COMMON FUNCTION TO DISPLAY WARNING MESSAGE IN SNACKBAR
 *
 * @param {String} message [message to show]
 */
export const showWarnMsg = (msg) => {
  showNotification(msg, 'warn');
};

/**
 * COMMON FUNCTION TO DISPLAY INFO MESSAGE IN SNACKBAR
 *
 * @param {String} message [message to show]
 */
export const showInfoMsg = (msg) => {
  showNotification(msg, 'info');
};

/**
 * COMMON FUNCTION TO DISPLAY NOTIFICATION
 *
 * @param {String} msg
 * @param {String} variant ['success', 'warning', 'info', 'error']
 *
 * @return {Object}
 */
const showNotification = (msg, variant) => {
  const snack_data = {
    message: msg ? String(msg) : MESSAGES.INTERNAL_ERROR,
    variant,
  };
  const e = new CustomEvent('setToastify', { detail: snack_data });
  document.dispatchEvent(e);
};

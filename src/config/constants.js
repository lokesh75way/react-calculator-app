const moment = require('moment');

/**
 * COMMON API RESPONSE HANDLE MESSAGES
 */
export const MESSAGES = {
  SERVER_ERROR: 'Something went wrong',
  INTERNAL_ERROR: 'Internal Error',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'You have taken a wrong turn',
  BAD_GATEWAY: 'Bad gateway',
};

/**
 * CALENDER(DATE PICKER) CONFIG
 */
export const CALENDER_CONFIG = {
  START_DATE: new Date(moment().add(1, 'days').format()),
  END_DATE: new Date(moment().add(7, 'days').format()),
};

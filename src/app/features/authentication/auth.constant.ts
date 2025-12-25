import {
  APP_FEATURES as FEATURES,
  APP_HTML_ELEMENTS as HTML_ELEMENTS,
} from '~core/constants';

/* Define specific Ids for UI elements */
export const AUTH_ID = {
  AUTH_LOGIN_FORM: `${FEATURES.AUTH}-${HTML_ELEMENTS.FORM}-login`,
  AUTH_LOGIN_PAGE: `${FEATURES.AUTH}-loginPage`,

  BUTTON_LOGIN: `${FEATURES.AUTH}-${HTML_ELEMENTS.BUTTON}-login`,
};

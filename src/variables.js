import runtimeEnv from "@mars/heroku-js-runtime-env";

const env = runtimeEnv();

// Collection of variables used across the application.
const Variables = {
  API_ROOT: env.REACT_APP_API_ROOT,
  TOKEN_NAME: "idToken",
  RETURN_URL_KEY: "returnUrl",
  PAGE_SIZE: 20, // When should pagination be triggered.

  AUTH0_CLIENT_ID: env.REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: env.REACT_APP_AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: env.REACT_APP_AUTH0_CALLBACK_URL,
  AUTH0_ADD_TO_SLACK_CALLBACK_URL:
    env.REACT_APP_AUTH0_ADD_TO_SLACK_CALLBACK_URL,

  GOOGLE_ANALYTICS_ID: env.REACT_APP_GOOGLE_ANALYTICS_ID,

  CLOUDINARY_UPLOAD_URL: env.REACT_APP_CLOUDINARY_URL + "/image/upload",
  CLOUDINARY_UPLOAD_PRESET: env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_DELETE_URL: env.REACT_APP_CLOUDINARY_URL + "/delete_by_token",
  CLOUDINARY_SERVING_URL_PREFIX:
    "https://res.cloudinary.com/relaypad/image/upload",
  CLOUDINARY_POST_IMAGE_PREFIX:
    "https://res.cloudinary.com/relaypad/image/upload/c_scale,w_auto,dpr_auto"
};

export default Variables;

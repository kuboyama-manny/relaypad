import Auth0 from "auth0-js";
import Variables from "./variables";

/**
 * Provides a RelayPad specific interface to auth0-js functionality.
 * Mainly copied from tutorials provided by auth0.
 */
export default class AuthService {
  constructor() {
    // Configure Auth0 client
    this.auth0 = new Auth0.WebAuth({
      clientID: Variables.AUTH0_CLIENT_ID,
      domain: Variables.AUTH0_DOMAIN
    });
  }

  /**
   * Used to initiate Auth0 social logins (e.g. Slack)
   * based on parameters provided, see calling methods.
   * Params must include:
   * @param {String} connection: Name of connection in Auth0, e.g. "slack"
   * @param {String} redirectUri: Callback URL, varies between environments
   * @param {String} responseType: Want this to be 'token' in most cases
   */
  _authorize = (params, onError) => {
    this.auth0.authorize(params, onError);
  };

  /**
   * Triggers redirect to slack to enable "Sign in with Slack" flow.
   * Key item to note is that the connection name is "slack", corresponding to
   * auth0 "extension" that powers our "Sign in with Slack" flow and
   * only requests identity information.
   *
   * @method slackLogin
   */
  slackLogin = () => {
    this._authorize(
      {
        connection: "slack",
        responseType: "token id_token",
        scope: "openid user_id nickname email name avatar team", // Slack information we want in auth0 JWT
        leeway: 10, // Latency leeway for JWT iat claim, see https://github.com/auth0/auth0.js/issues/290
        redirectUri: Variables.AUTH0_CALLBACK_URL
      },
      function(err) {
        console.log("Slack login error: ", err);
      }
    );
  };

  /**
   * Triggers redirect to slack to enable "Sign in with Slack" flow.
   * Key item to note is that the connection name is "add-to-slack", corresponding to
   * auth0 "extension" that powers our "Add to Slack" flow and requests all
   * the permissions we need to power slack integration (e.g. ability to send daily briefing)
   *
   * @method addToSlack
   */
  addToSlack = () => {
    this._authorize(
      {
        connection: "add-to-slack",
        responseType: "token id_token",
        scope: "openid user_id",
        redirectUri: Variables.AUTH0_ADD_TO_SLACK_CALLBACK_URL
      },
      function(err) {
        console.log("Add to Slack error: ", err);
      }
    );
  };

  /**
   * Uses Auth0 parseHash functionality to extract data sent to Auth0 callback URL.
   * A JWT ("idToken") will be returned and includes basic user and team information.
   * This JWT will be added to localstorage for further use with RelayPad API calls.
   */
  parseSignInCallbackHash(hash) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken) {
        AuthService.setToken(authResult.idToken); // JWT returned from Auth0;

        // Redirect user to content.
        const returnUrl = localStorage.getItem(Variables.RETURN_URL_KEY);
        localStorage.removeItem(Variables.RETURN_URL_KEY);
        returnUrl
          ? window.location.replace(returnUrl)
          : window.location.replace("/");
      } else if (err) {
        console.log("Error with auth callback", err);
        window.location.replace("https://relaypad.com"); // If auth fails, send user to marketing page.
      }
    });
  }

  /**
   * Parses the hash returned from Auth0 for the "add to slack" flow.
   * This hash will include `user_id` as stored by Auth0, allowing us
   * to send that value to the RelayPad API. This `user_id` can then be
   * used to obtain `access_token` to use for Slack integration.
   */
  parseAddToSlackCallbackHash(hash) {
    this.auth0.parseHash(hash, (err, authResult) => {
      if (authResult) {
        window.location.replace("/slack-connector?installing=true");
      } else if (err) {
        console.log("Error with add to slack callback", err);
        window.location.replace("/");
      }
    });
  }

  static loggedIn() {
    return !!this.getToken();
  }

  static setToken(token) {
    localStorage.setItem(Variables.TOKEN_NAME, token);
  }

  static getToken() {
    return localStorage.getItem(Variables.TOKEN_NAME);
  }

  static removeToken() {
    localStorage.removeItem(Variables.TOKEN_NAME);
  }
}

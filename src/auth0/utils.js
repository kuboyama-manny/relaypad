import Variables from "../variables";
import AuthService from "../auth_service";

export const auth = new AuthService(
  Variables.AUTH0_CLIENT_ID,
  Variables.AUTH0_DOMAIN
);

export const requireAuth = (location, history) => {
  if (!AuthService.loggedIn()) {
    localStorage.setItem(Variables.RETURN_URL_KEY, location.pathname);
    history.push(
      localStorage.getItem("returnUser")
        ? "/signin"
        : "/signin/welcome-to-relaypad"
    );

    return false;
  }

  return true;
};

export const parseSignInCallbackHash = location => {
  if (location.hash) {
    auth.parseSignInCallbackHash(location.hash);
  }

  return true;
};

export const parseAddToSlackCallbackHash = location => {
  if (location.hash) {
    auth.parseAddToSlackCallbackHash(location.hash);
  }

  return true;
};

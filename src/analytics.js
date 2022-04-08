import ReactGA from "react-ga";
import Variables from "./variables";

/**
  * Interface to web analytics services, mainly Google Analytics to start.
  */
export default class Analytics {
  constructor() {
    this.ga = ReactGA.initialize(Variables.GOOGLE_ANALYTICS_ID);
  }

  logPageView = () => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  };
}

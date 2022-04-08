import { Component } from "react";
import AuthService from "../auth_service";

class SigninContainer extends Component {
  componentWillMount() {
    const auth = new AuthService();
    localStorage.setItem("returnUser", true);
    auth.slackLogin(); // Immediately send user to Slack sign in flow.
  }

  render() {
    return null;
  }
}

export default SigninContainer;

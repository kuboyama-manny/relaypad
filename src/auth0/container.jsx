import React from "react";
import { withRouter } from "react-router-dom";
import { isEqual } from 'lodash';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {render: true};
  }

  componentWillMount() {
    this.setState({render: this.props.onEnter(this.props.location, this.props.history)});
  }

  componentWillReceiveProps(nextProps) {
    if(!isEqual(nextProps.location, this.props.location)) {
      this.setState({render: this.props.onEnter(this.props.location, this.props.history)});
    }
  }

  render() {
    const {component: Component, onEnter, ...rest} = this.props;
    return this.state.render ? <Component {...rest} /> : null;
  }
}

export default withRouter(Container);

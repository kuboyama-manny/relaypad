import React from "react";
import { URL_REGEX, EMAIL_REGEX } from "../constants";
import PropTypes from "prop-types";

const getUrlFromProps = props => {
  const data = props.entityKey
    ? props.contentState.getEntity(props.entityKey).getData()
    : {};
  return data.url || props.decoratedText || props.url;
};

const addProtocolToUrl = url => {
  if (url.match(URL_REGEX)) {
    return url.match(/^http/i) ? url : `http://${url}`;
  }
  if (url.match(EMAIL_REGEX)) {
    return url.match(/^mailto/i) ? url : `mailto:${url}`;
  }
  return url;
};

const Link = props => {
  const url = getUrlFromProps(props);
  const urlWithProtocol = addProtocolToUrl(url);
  return (
    <a href={urlWithProtocol} title={props.decoratedText}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
  decoratedText: PropTypes.string
};

export default Link;

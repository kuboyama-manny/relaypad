import findWithRegex from "find-with-regex";

const regexStrategy = regex =>
  (contentBlock, callback) => findWithRegex(regex, contentBlock, callback);

export default regexStrategy;

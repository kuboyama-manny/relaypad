const protocol = "(?:(?:[a-z]+:)?//)";
const auth = "(?:\\S+(?::\\S*)?@)?";
const ip = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}";
const host = "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)";
const domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
const tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?";
const port = "(?::\\d{2,5})?";
const path = '(?:[/?#][^\\s"]*)?';

const urlRegex = new RegExp(
  `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`,
  "ig"
);

export default urlRegex;

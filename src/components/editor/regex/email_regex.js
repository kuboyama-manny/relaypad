const emailRegex = new RegExp(
  "[^\\.\\s@][^\\s@]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*",
  "ig"
);

export default emailRegex;

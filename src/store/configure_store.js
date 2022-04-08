if (process.env.NODE_ENV === "production") {
  module.exports = require("./configure_prod_store");
} else {
  module.exports = require("./configure_dev_store");
}

// NOTE: Based on https://github.com/facebook/create-react-app/issues/3518#issue-277616195
// just run `node webpack-bundle-analyzer.js` from the root directory to launch a browser window with the bundle size visualization.

process.env.NODE_ENV = "production";
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const webpackConfigProd = require("react-scripts/config/webpack.config.prod");

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "report.html"
  })
);

require("react-scripts/scripts/build");

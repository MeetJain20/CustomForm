const path = require("path");

module.exports = {
  entry: {
    "push-notification": "./web/js/push-notification.ts",
    "firebase-messaging-sw": "./web/js/firebase-messaging-sw.ts",
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname),
  },
  resolve: {
    extensions: [".ts"],
  },
};

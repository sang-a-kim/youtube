const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
	entry: "./src/client/js/main.js",
  plugins: [new MiniCssExtractPlugin({
    filename: "css/main.css"
  })],
  mode: 'development',
  watch: true,
	output: {
		path: path.resolve(__dirname, "assets"),
		filename: "js/main.js",
    clean: true
	},
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  }
};

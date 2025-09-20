const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    entry: {
      main: "./src/pages/index.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
      // Use '/' for dev server so webpack-dev-server serves from root URL
      // and './' for production so generated files work when hosted under
      // a repository subpath (GitHub Pages project pages).
      publicPath: isProd ? './' : '/',
    },

    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : "inline-source-map",
    stats: "errors-only",

    devServer: {
      static: path.resolve(__dirname, "./dist"),
      compress: true,
      port: 8080,
      open: true,
      liveReload: true,
      hot: true,
    },

  target: ["web", "es5"],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif|woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "postcss-loader",
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/images/favicon.ico",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  };
};

const Path = require("path")
const Webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const PurgecssPlugin = require("purgecss-webpack-plugin")
const PreloadWebpackPlugin = require("preload-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")



const BuildPath = Path.resolve(__dirname, "public")

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []
  }
}

module.exports = {
  devtool: "source-map",
  entry: "./src/app.js",
  output: {
    filename: "[name].[hash:20].js",
    path: BuildPath
  },
  node: {
    fs: "empty"
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["env"]
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader"
          ]
        })
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([BuildPath], {
      root: __dirname,
      exclude: ['CNAME', 'robots.txt'],
      verbose: true,
      dry: false
    }),
    new Webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new ExtractTextPlugin("main.css", {
      disable: process.env.NODE_ENV === "development"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      inject: true
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      as(entry) {
        if (/\.css$/.test(entry)) return "style"
        if (/\.png$/.test(entry)) return "image"
        return "script"
      }
    }),
    new CopyWebpackPlugin([
      { from: "images", to: "images" }
    ]),
    new PurgecssPlugin({
      // Specify the locations of any files you want to scan for class names.
      paths: "src/index.html",
      whitelist: ['text-red-darker', 'text-brand-btn'],
      extractors: [
        {
          extractor: TailwindExtractor,

          // Specify the file extensions to include when scanning for
          // class names.
          extensions: ["html"]
        }
      ]
    })
  ]
}

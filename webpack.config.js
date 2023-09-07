/* eslint-disable no-undef */
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = ({ mode } = { mode: "production" }) => {
    console.log(`mode is: ${mode}`);
    return {
        mode,
        devServer: {
            hot: true,
            open: true
        },
        entry: "./src/index.js",
        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "build"),
            filename: "bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.jpe?g|png|svg$/,
                    exclude: /node_modules/,
                    options: { name: "[name].[ext]" },
                    loader: "file-loader"
                    // use: ["url-loader", "file-loader"]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react", {
                            'plugins': ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime']
                        }]
                    }
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            }),
        ]
    }
};
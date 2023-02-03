/* eslint-disable import/namespace */
/* eslint-disable import/default */

import path from "path";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import 'dotenv/config';

export default {
	mode: "production",
	devtool: "source-map",
	entry: {
		main: {
			import: "./src/index.js",
			dependOn: 'vendor'
		},
		vendor: "./src/vendor.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: "/",
		filename: "[name].[chunkhash].js",
	},
	plugins: [
		// Generate an external css file with a hash in the filename
		new MiniCssExtractPlugin({
			filename: "[name].[chunkhash].css"
		}),
		// Create HTML file that includes reference to bundled JS
		new HtmlWebpackPlugin({
			template: "src/index.html",
			// Properties we define here are available in index.html
			// using htmlWebpackPlugin.options.varName
			trackJSToken: process.env.TRACKJS_TOKEN
		}),
	],
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
		],
	},
};

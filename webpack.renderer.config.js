const CopyWebpackPlugin = require("copy-webpack-plugin"),
	{ VueLoaderPlugin } = require("vue-loader"),
	rules = require("./webpack.rules"),
	plugins = require("./webpack.plugins");

rules.push(
	{
		test: /\.css$/,
		use: [{ loader: "style-loader" }, { loader: "css-loader" }],
	},

	{
		test: /\.png$/,
		use: {
			loader: "file-loader",
			options: {
				name: "[path][name].[ext]",
				publicPath: "..",
				context: "src",
			},
		},
	},

	{
		test: /\.scss$/,
		use: [{ loader: "style-loader" }, { loader: "css-loader" },  { loader: "sass-loader" }],
	},
);

plugins.push(
	new VueLoaderPlugin(),
);

module.exports = {
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".scss", ".png"]
	},
};

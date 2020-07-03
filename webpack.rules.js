module.exports = [
	// Add support for native node modules
	{
		test: /\.node$/,
		use: 'node-loader',
	},
	{
		test: /\.(m?js|node)$/,
		parser: { amd: false },
		use: {
			loader: '@marshallofsound/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules',
			},
		},
	},
	{
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/],
				transpileOnly: true,
			}
		}
	},
	{
		test: /\.vue$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: "vue-loader",
		}
	},
];

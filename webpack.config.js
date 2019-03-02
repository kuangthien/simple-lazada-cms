const path = require('path');

module.exports = {
	entry: './src/cms/cms.js',
	output: {
		filename: './admin/cms.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		contentBase: './dist',
	},
};

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/cms/cms.js',
    output: {
        filename: './cms.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist',
    },
    plugins: [new CopyPlugin([{ from: './public/images', to: './images' }])],
}

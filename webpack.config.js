const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    watch: true,
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
	entry: {
        pack: './src/scripts/release.js',
        common: [ 'jquery', 'react', 'react-dom' ]
    },
    module: {
        noParse: /jquery/,
        rules: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.scss|\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
}

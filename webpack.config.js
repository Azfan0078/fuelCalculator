const webpack = require("webpack")
const path = require('path')
const { resolve } = require("path")
const copyWebpackPlugin = require("copy-webpack-plugin")
const miniCssExtractPlugin = require("mini-css-extract-plugin")
const cssMinimizerPlugin = require("css-minimizer-webpack-plugin")

module.exports = {
    mode:'production',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "app.js"
    },
    plugins: [
        new copyWebpackPlugin({
            patterns:[
                {from: '**/*.html', context:'src/assets/html'}
            ]
        }),
        new miniCssExtractPlugin({
            filename:'style.css'
        })
    ],
    module:{
        rules:[
            {
                test:/.s?scss$/,
                use: [miniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    optimization:{
        minimizer:[
            new cssMinimizerPlugin()
        ]
    }

}
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const { CleanWebpackPlugin  } = require("clean-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        htmldiff: ['./src/Diff.js'],
    },

    output: {
        filename: 'htmldiff.min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        library: 'HtmlDiff',
        libraryTarget: 'commonjs2'
    },

    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(
            {
                dry: false,
                cleanOnceBeforeBuildPatterns: [
                    "dist"
                ]
            }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UnminifiedWebpackPlugin(),
        //new BundleAnalyzerPlugin()   
    ],

    optimization: {
        minimize: true
    }
};
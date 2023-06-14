const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const { CleanWebpackPlugin  } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        htmldiff: ['./src/Diff.js'],
    },

    output: {
        filename: 'htmldiff.min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        library: {
            type: 'module',
          }
    },

    experiments: {
        outputModule: true
      },

    node: false,

    plugins: [
        new CleanWebpackPlugin(
            {
                dry: false,
                cleanOnceBeforeBuildPatterns: [
                    "dist"
                ]
            }),
        new UnminifiedWebpackPlugin(),
        //new BundleAnalyzerPlugin()
    ],

    optimization: {
        minimize: true
    }
};
const path = require('path');

module.exports = {
    entry: './lib/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: "gridjson",
        filename: 'gridjson.bundle.js',
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: {
                                    browsers: ['Chrome >= 59', 'Firefox >= 53', 'Safari >= 10', 'Edge >= 14', 'Explorer >= 11']
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    }
};
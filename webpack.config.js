const path = require('path');
module.exports = {
    entry: {
        app: './src/app.ts',
        bgPos: './src/bgPos.ts',
        canvasList: './src/canvasList.ts',
        index: './src/index.ts',
        position: './src/position.ts',
        square: './src/square.ts',
        squareInterface: './src/squareInterface.ts',
        files: './src/files.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    watch: true
};
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json'
          }
        }],
        exclude: /node_modules/
      }
    ],
  },
  externals: {
    'sqlite3':'commonjs sqlite3'
  }
};

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  mode: 'production',
  watch: true,
  entry: {
    background: path.resolve(__dirname, '..', 'src', 'background.ts'),
    inject: path.resolve(__dirname, '..', 'src', 'inject.ts'),
    options: path.resolve(__dirname, '..', 'src', 'options.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '.', context: 'public' }],
    }),
  ],
}

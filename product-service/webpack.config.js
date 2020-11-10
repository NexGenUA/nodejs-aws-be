const sls = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: sls.lib.entries,
  mode: sls.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  externals: [nodeExternals()]
};

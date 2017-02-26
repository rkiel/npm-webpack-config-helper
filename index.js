const path = require('path');

function Helper(env) {
  this.env = env;
  this.config = {};
  this.config.entry = {};
  this.config.output = {};
  this.config.module = {
    rules: []
  };
  this.config.plugins = [];
  this.entry('bundle', './src/index.js');
  this.output('build');
  this.defaultEntry = true;
}

Helper.prototype.entry = function(bundleName, entryPath) {
  if (this.defaultEntry) {
    this.config.entry = {};
    this.defaultEntry = false;
  }
  this.config.entry[bundleName] = entryPath;
  return this;
}

Helper.prototype.output = function(directory) {
  this.config.output.path = path.resolve(process.cwd(), directory);
  this.config.output.filename = '[name].[chunkhash].js';
  return this;
}

Helper.prototype.addPublicPath = function() {
  this.config.output.publicPath = config.output.path.split('/').reverse()[0] + '/'
  return this;
}

Helper.prototype.addRuleForBabel = function (overridePattern) {
  const pattern = overridePattern || /\.jsx?$/;
  const rule = {
    use: 'babel-loader',
    test: pattern,
    exclude: "/node_modules/"
  };
  this.config.module.rules.push(rule);
  return this;
}

Helper.prototype.addRuleForCssAndStyle = function() {
  const rule = {
    use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]_[local]_[hash:base64:5]',
    test: /\.css$/
  }
  this.config.module.rules.push(rule);
  return this;
}

Helper.prototype.addRuleForExtractCss = function(cssName) {
  var name = cssName || '[name].[contenthash].css';
  const ExtractTextPlugin = require('extract-text-webpack-plugin');

  const rule = {
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader?modules&localIdentName=[path][name]_[local]_[hash:base64:5]'
    }),
    test: /\.css$/
  }
  const plugin = new ExtractTextPlugin(name);
  this.config.module.rules.push(rule);
  this.config.plugins.push(plugin);
  return this;
}

Helper.prototype.addHtmlWebpackPlugin = function(overrideOptions) {
  var defaultOptions = {
    template: './src/index.html',
    inject: 'body'
  };
  var options = overrideOptions || defaultOptions;
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  this.config.plugins.push(new HtmlWebpackPlugin(options));
  return this;
}

Helper.prototype.addCommonsChunk = function (name) {
  var webpack = require('webpack');
  const plugin = new webpack.optimize.CommonsChunkPlugin({
    names: [name, 'manifest']
  });
  this.config.plugins.push(plugin);
  return this;
}

Helper.prototype.entryAndCommonsChunk = function (name, modules) {
  this.defaultEntry = false;
  if (modules) {
    this.entry(name, modules);
  } else {
    var fs = require('fs');
    const content = fs.readFileSync(path.resolve(process.cwd(), 'package.json'));
    const packageJson = JSON.parse(content);
    this.entry(name, Object.keys(packageJson.dependencies||[]));
  }
  this.addCommonsChunk(name);
  return this;
}

Helper.prototype.custom = function(cb) {
  cb(this.config);
  return this;
}

Helper.prototype.echo = function(msg) {
  console.log();
  if (msg) {
    console.log(msg);
    console.log();
  }
  console.log(JSON.stringify(this.config, null, '  '));
  console.log();
  return this;
}

Helper.prototype.exports = function() {
  return this.config;
}

Helper.prototype.addRuleForImages = function() {
  const rule = {
    test: /\.(jpg|jpeg|png|gif|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: {limit: 40000} // 40K
      },
      'image-webpack-loader' // applied from right to left
    ]
  };
  this.config.module.rules.push(rule);
  return this;
}

// window scope variables
// NODE_ENV is used by React
Helper.prototype.addEnvironment = function() {
  var webpack = require('webpack');
  this.config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(this.env||process.env.NODE_ENV)
  }));
  return this;
}

Helper.use = function(cb) {
  return function(env) {
    var helper = new Helper(env);
    if (cb) {
      cb(helper);
    }
    return helper.exports();
  }
}

module.exports = Helper;

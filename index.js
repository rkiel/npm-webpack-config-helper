const path = require('path');

function helper(c) {
  if (c) {
    this.config = c;
  } else {
    this.config = {};
  }
  this.config.entry = '';
  this.config.output = {};
  this.config.module = {
    rules: []
  };
  this.config.plugins = [];
  this.entry('./src/index.js');
  this.output('build', 'bundle.js');
}

helper.prototype.entry = function(path) {
  this.config.entry = path;
  return this;
}

helper.prototype.output = function(directory, filename) {
  this.config.output.path = path.resolve(__dirname, directory);
  this.config.output.filename = filename;
  return this;
}

helper.prototype.addRuleForBabel = function () {
  const rule = {
    use: 'babel-loader',
    test: /\.js$/,
    exclude: "/node_modules/"
  };
  this.config.module.rules.push(rule);
  return this;
}

helper.prototype.addRuleForCssAndStyle = function() {
  const rule = {
    use: ['style-loader', 'css-loader'], // applied from right to left
    test: /\.css$/
  }
  this.config.module.rules.push(rule);
  return this;
}

helper.prototype.custom = function(cb) {
  cb(this.config);
  return this;
}

helper.prototype.echo = function(msg) {
  console.log();
  if (msg) {
    console.log(msg);
    console.log();
  }
  console.log(JSON.stringify(this.config, null, '  '));
  console.log();
  return this;
}

helper.prototype.exports = function() {
  return this.config;
}

// used by some loaders including url-loader
function addPublicPath(config) {
  config.output.publicPath = config.output.path.split('/').reverse()[0] + '/'
  return config;
}

function addRuleForExtracText(config) {
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const rule = {
    loader: ExtractTextPlugin.extract({
      loader: 'css-loader' // plugin replaces style-loader
    }),
    test: /\.css$/
  }
  const plugin = new ExtractTextPlugin('style.css');
  config.module.rules.push(rule);
  config.plugins.push(plugin);
  return config;
}

function addRuleForImages(config) {
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
  config.module.rules.push(rule);
  return config;
}

module.exports = helper;

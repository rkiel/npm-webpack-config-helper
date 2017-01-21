const path = require('path');

function Helper(c) {
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

Helper.prototype.entry = function(path) {
  this.config.entry = path;
  return this;
}

Helper.prototype.output = function(directory, filename) {
  this.config.output.path = path.resolve(__dirname, directory);
  this.config.output.filename = filename;
  return this;
}

Helper.prototype.addPublicPath = function() {
  this.config.output.publicPath = config.output.path.split('/').reverse()[0] + '/'
  return this;
}

Helper.prototype.addRuleForBabel = function () {
  const rule = {
    use: 'babel-loader',
    test: /\.js$/,
    exclude: "/node_modules/"
  };
  this.config.module.rules.push(rule);
  return this;
}

Helper.prototype.addRuleForCssAndStyle = function() {
  const rule = {
    use: ['style-loader', 'css-loader'], // applied from right to left
    test: /\.css$/
  }
  this.config.module.rules.push(rule);
  return this;
}

Helper.prototype.addRuleForExtractCss = function(cssName) {
  var name = cssName || 'style.css';
  const ExtractTextPlugin = require('extract-text-webpack-plugin');

  const rule = {
    loader: ExtractTextPlugin.extract({
      loader: 'css-loader' // plugin replaces style-loader
    }),
    test: /\.css$/
  }
  const plugin = new ExtractTextPlugin(name);
  this.config.module.rules.push(rule);
  this.config.plugins.push(plugin);
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

module.exports = Helper;

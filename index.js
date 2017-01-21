const path = require('path');

var object;
var config;

function init(c) {
  if (c) {
    config = c;
  } else {
    config = {};
  }
  config.entry = '';
  config.output = {};
  config.module = {
    rules: []
  };
  config.plugins = [];
  object.entry('./src/index.js');
  object.output('build', 'bundle.js');
  return object;
}

function entry(path) {
  config.entry = path;
  return object;
}

function output(directory, filename) {
  config.output.path = path.resolve(__dirname, directory);
  config.output.filename = filename;
  return object;
}

function ruleForBabel() {
  const rule = {
    use: 'babel-loader',
    test: /\.js$/,
    exclude: "/node_modules/"
  };
  config.module.rules.push(rule);
  return object;
}

function ruleForCssAndStyle() {
  const rule = {
    use: ['style-loader', 'css-loader'], // applied from right to left
    test: /\.css$/
  }
  config.module.rules.push(rule);
  return object;
}

function generate(o) {
  var options = o || {};
  if (options.verbose) {
    console.log(JSON.stringify(config, null, '  '));
  }
  return config;
}

object = {
  entry: entry,
  output: output,
  addRuleForBabel: ruleForBabel,
  addRuleForCssAndStyle: ruleForCssAndStyle,
  generate: generate
};


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

module.exports = {
  init: init,
  addPublicPath: addPublicPath,
  addRuleForExtracText: addRuleForExtracText,
  addRuleForImages: addRuleForImages,
  build: build
}

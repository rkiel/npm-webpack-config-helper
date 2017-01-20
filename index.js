const path = require('path');

function addMinimum(config) {
  config.entry = './src/index.js';  // relative path

  config.output = {
    path: path.resolve(__dirname, 'build'), // absolute path
    filename: 'bundle.js'
  };
  return config;
}

// used by some loaders including url-loader
function addPublicPath(config) {
  config.output.publicPath = config.output.path.split('/').reverse()[0] + '/'
  return config;
}

function initForModuleRules(config) {
  config.module = {
    rules: []
  };
  return config;
}

function initForPlugins(config) {
  config.plugins = [];
  return config;
}

function addRuleForBabel(config) {
  const rule = {
    use: 'babel-loader',
    test: /\.js$/,
    exclude: "/node_modules/"
  };
  config.module.rules.push(rule);
  return config;
}

function addRuleForCssAndStyle(config) {
  const rule = {
    use: ['style-loader', 'css-loader'], // applied from right to left
    test: /\.css$/
  }
  config.module.rules.push(rule);
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

function build(steps) {
  cosnt config = steps.reduce(function(config, step) {
    return step(config);
  }, {});

  console.log(JSON.stringify(config, null, '  '));

  return config;
}

module.exports = {
  addMinimum: addMinimum,
  addPublicPath: addPublicPath,
  initForModuleRules: initForModuleRules,
  initForPlugins: initForPlugins,
  addRuleForBabel: addRuleForBabel,
  addRuleForCssAndStyle: addRuleForCssAndStyle,
  addRuleForExtracText: addRuleForExtracText,
  addRuleForImages: addRuleForImages,
  build: build
}

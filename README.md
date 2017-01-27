# webpack-config-helper

Utility to make it easier to construct your webpack config.  It only supports the Webpack 2 config.

This helper is based on the material presented in Stephen Grider's Udemy course [Webpack 2: The Complete Developer's Guide](https://www.udemy.com/webpack-2-the-complete-developers-guide/).

For more information about Webpack, be sure to read the [Concepts](https://webpack.js.org/concepts/) and [Guides](https://webpack.js.org/guides/).


## Installation

This module is distributed via **npm** which is bundled with **node** and should
be installed as one of your project's `devDependencies`:

Using npm

```
npm install --save-dev webpack-config-helper
```

or yarn

```
yarn add --dev webpack-config-helper
```

## Usage

It is expected that you use this in your `webpack.config.js` file.  For example, to create a config that uses Babel, splits vendor code into a separate bundle, and bundles up CSS, you might using something like the following.

```javascript
const Helper = require('webpack-config-helper');

function buildConfig(config) {
  config
  .entryAndCommonsChunk('vendor')
  .addRuleForBabel()
  .addRuleForCssAndStyle()
  .echo();
}

module.exports = Helper.use(buildConfig);
```

## Summary

* `use` -- invoke the constructor to create minimal webpack config
* `entry` -- override the default entry point
* `entryAndCommonsChunk` -- add entry point and code splitting
* `output` -- override the default output
* `addRuleForBabel` -- add a rule to support Babel (NOTE: requires prerequisites)
* `addRuleForCssAndStyle` -- add a rule to support CSS and Style loaders (NOTE: requires prerequisites)
* `addRuleForExtractCss` -- add a rule to support extracting CSS into a file (NOTE: requires prerequisites)
* `addRuleForImages` -- add a rule to support images (NOTE: requires prerequisites)
* `addCommonsChunk` -- add a plugin to support code splitting (NOTE: requires prerequisites)
* `addHtmlWebpackPlugin` -- add a plugin to support creating top-level html file (NOTE: requires prerequisites)
* `addEnvironment` -- add NODE_ENV as a window scope variable for React (called by `use`)
* `custom` -- invoke callback to allow custom changes to the config object
* `echo` -- display the current state of the config object

#### use ( _callback_ )

The `use` factory method creates a minimal webpack configuration choosing defaults for `entry` and `output`.
The options _callback_ function takes an instance of the Helper.

```javascript
const Helper = require('webpack-config-helper');

function buildConfig(config) {
}

module.exports = Helper.use(buildConfig);
```

will generate the following.

```javascript
{
  "entry": {
    "bundle": "./src/index.js"
  },
  "output": {
    "path": "/full/path/to/build",
    "filename": "[name].[chunkhash].js"
  },
  "module": {
    "rules": []
  },
  "plugins": []
}
```

#### entry ( _bundle_ , _path_ )

Override the default entry point.  For example,

```javascript
function buildConfig(config) {
  config.entry('app', './src/app.js');
}
```

will update the config in the following way.

```javascript
{
  "entry": {
    "app": "./src/app.js"
  }
}
```

#### output ( _directory_ )

Override the default output.  For example,

```javascript
function buildConfig(config) {
  config.output('dest');
}
```

will update the config in the following way.

```javascript
{
  "output": {
    "path": "/full/path/to/dest",
    "filename": "[name].[chunkhash].js"
  }
}
```

#### addRuleForBabel

Add a rule to the `module.rules` for Babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForBabel();
}
```

will push the following rule to `module.rules`.

```javascript
{
  use: 'babel-loader',
  test: /\.js$/,
  exclude: "/node_modules/"
}
```

There are two prerequisites to adding this to your config.  First, you need to install Babel.  For example,

```unix
npm install --save-dev babel-loader babel-core babel-preset-env  # for example
```

And second, you need to create a `.babelrc` file.  For example,

```json
{
  "presets": ["babel-preset-env"]
}
```

#### addRuleForCssAndStyle

Add a rule to the `module.rules` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForCssAndStyle();
}
```

will push the following rule to `module.rules`.

```javascript
{
  use: ['style-loader', 'css-loader'],
  test: /\.css$/
}
```

There is a prerequisite to adding this to your config.  You need to install the css and style loaders.  For example,

```unix
npm install --save-dev style-loader css-loader # for example
```

#### addRuleForExtractCss ( _cssName_ )

Add a rule to the `module.rules` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForExtractCss();
}
```

will push the following rule to `module.rules`.

```javascript
{
  loader: ExtractTextPlugin.extract({
    loader: 'css-loader'
  }),
  test: /\.css$/
}
```

and will push the following plugin to `plugins`

```javascript
new ExtractTextPlugin('style.css')
```

There is a prerequisite to adding this to your config.  You need to install the css loader and extract text plugin.  For example,

```unix
npm install --save-dev css-loader extract-text-webpack-plugin # for example
```

#### addRuleForImages

Add a rule to the `module.rules` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForImages();
}
```

will push the following rule to `module.rules`.

```javascript
{
  test: /\.(jpg|jpeg|png|gif|svg)$/,
  use: [
    {
      loader: 'url-loader',
      options: {limit: 40000} // 40K
    },
    'image-webpack-loader' // applied from right to left
  ]
}
```

There is a prerequisite to adding this to your config.  You need to install the image and url loaders.  For example,

```unix
npm install --save-dev image-webpack-loader url-loader # for example
```

#### addHtmlWebpackPlugin ( [_options_] )

To add the html webpack plugin with a default template to `plgins` for .  For example,

```javascript
function buildConfig(config) {
  config.addHtmlWebpackPlugin();
}
```

will push the following plugin to `plugins`

```javascript
new HtmlWebpackPlugin({
  template: './src/index.html',
  inject: 'body'
})
```

You can also pass an options object to customize the plugin.  For example,

```javascript
function buildConfig(config) {
  config.addHtmlWebpackPlugin({
    template: './assets/index.html'
  });
}
```

will push the following plugin to `plugins`

```javascript
new HtmlWebpackPlugin({
  template: './assets/index.html'
})
```

There is a prerequisite to adding this to your config.  You need to install the html webpack plugin.  For example,

```unix
npm install --save-dev html-webpack-plugin # for example
```

#### addCommonsChunk

Add a plugin to the `plugins` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addCommonsChunk('vendor');
}
```

will push the following plugin to `plugins`.

```javascript
new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'manifest']
})
```

There is a prerequisite to adding this to your config.  You need to install the image and url loaders.  For example,

```unix
npm install --save-dev webpack
```

#### entryAndCommonsChunk ( _bundle_ [, _modules_] )

Add an entry point for the CommonsChunkPlugin.  You can specify the modules explicitly or have them read from `package.json`.  For example, specifying explicitly,

```javascript
function buildConfig(config) {
  config.entryAndCommonsChunk('vendor', ['react', 'redux']);
}
```

will update the `entry` in the following way.

```javascript
{
  "entry": {
    "bundle": "./src/index.js",
    "vendor": ["react", "redux"]
  }
}
```

and the `plugins` in the following way.

```javascript
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  });
```

For example, reading from `package.json`,

```javascript
function buildConfig(config) {
  config.entryAndCommonsChunk('vendor');
}
```


will update the `entry` in the following way.  (Assuming that `lodash` was specified in the `dependencies` section of `package.json`)

```javascript
{
  "entry": {
    "bundle": "./src/index.js",
    "vendor": ["lodash"]
  }
}
```

#### custom ( _config_ )

This helper covers the basics.  There is no way to handle all possible cases.  So the `custom` method gives you a chance
to add whatever additional configurations you need.  For example,

```javascript
function buildConfig(helper) {
  helper.custom(function(config) {
    var SomeJsPlugin = require('some-js-plugin');

    config.module.rules.push({
      use: 'some-js-loader'
      test: /\.js$/
    });
    config.plugin.push(new SomeJsPlugin());
  });
}
```

#### addEnvironment

This method is called by `use`.  No need to invoke it explicitly.

```javascript
module.exports = Helper.use(buildConfig);
```

and will add this plugin to `plugins` in the following way.

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});
```

#### echo

Display the current state of the config.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForBabel().echo();
}
```

will display the config showing the `entry`, `output`, and `module.rules` for Babel.
You can display the config multiple times to see how it changes.  For example,

```javascript
function buildConfig(config) {
  config.echo().addRuleForBabel().echo();
}
```

will display the config at two different points in time.


## Other helpful things

#### Scripts

Add the following scripts to your `package.json`.

```json
"scripts": {
   "clean": "rm -rf build dist",
   "start": "npm run clean && webpack-dev-server --host 192.168.33.60 --port 3000",
   "build": "NODE_ENV=production npm run clean && webpack --progress -p"
 },
```

#### webpack-dev-server

Install the webpack-dev-server.

```unix
npm install --save-dev webpack-dev-server
```

## LICENSE

MIT

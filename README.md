# webpack-config-helper

Utility to make it easier to construct your webpack config.  It only supports the Webpack 2 config.

This helper is based on the material presented in Stephen Grider's Udemy course [Webpack 2: The Complete Developer's Guide](https://www.udemy.com/webpack-2-the-complete-developers-guide/).

For more information about Webpack, be sure to read the [Concepts](https://webpack.js.org/concepts/) and [Guides](https://webpack.js.org/guides/).

#### Definitions
* Modules -- preprocessing on each file before it is added to the output.
  * Webpack 1 - preprocessing steps are called loaders
  * Webpack 2 - preprocessing is part of the module system with each loader as rule
* Plugins -- work outside the Webpack pipleine.  Have the ability to keep files from ending up in the output.

## Installation

This module is distributed via **npm** which is bundled with **node** and should
be installed as one of your project's `devDependencies`:

```
yarn add --dev webpack-config-helper
```

## Usage

It is expected that you use this in your `webpack.config.js` file.  For example, to create a config that uses Babel, splits vendor code into a separate bundle, and bundles up CSS, you might using something like the following.

```javascript
const Helper = require('webpack-config-helper');

function buildConfig(config) {
  config
  .entry('bundle', './src/index.jsx')
  .entryAndCommonsChunk('vendor')
  .addRuleForBabel()
  .addRuleForInlineCssModules()
  .addHtmlWebpackPlugin()
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
* `addRuleForInlineCssModules` -- add a rule to support inline CSS modules (NOTE: requires prerequisites)
* `addRuleForExtractCssModules` -- add a rule to support extracting CSS modules into a file (NOTE: requires prerequisites)
* `addRuleForImages` -- add a rule to support images (NOTE: requires prerequisites)
* `addCommonsChunk` -- add a plugin to support code splitting (NOTE: requires prerequisites)
* `addHtmlWebpackPlugin` -- add a plugin to support creating top-level html file (NOTE: requires prerequisites)
* `addEnvironment` -- add the `webpack --env` value or the `process.env.NODE_ENV` as a window scope variable for React
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

Add a named entry point.
The first use of `entry` will override the default named entry point `bundle` to path `./src/index.js`.
Additional uses of `entry` add additional named entry points.
For example,

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

#### addRuleForBabel ( _overridePattern_ )

Add a rule to the `module.rules` for Babel.  By default, the file test pattern includes both `.js` and `.jsx`.  You can optionally pass in an override pattern. For example,

```javascript
function buildConfig(config) {
  config.addRuleForBabel();
}
```

will push the following rule to `module.rules`.

```javascript
{
  use: 'babel-loader',
  test: /\.jsx?$/,
  exclude: "/node_modules/"
}
```

There are two prerequisites to adding this to your config.  First, you need to install Babel.  For example,

```unix
yarn add --dev babel-core
yarn add --dev babel-loader
yarn add --dev babel-preset-es2015
yarn add --dev babel-preset-react
# yarn add --dev babel-preset-stage-0
# yarn add --dev babel-preset-env
```

* `babel-loader` - teaches Babel how to work with Webpack (compatibility layer)
* `babel-core` - knows how to take in code, parse it, and generate some output files

And second, you need to create a `.babelrc` file.  For example,

```json
{
  "presets": ["react", "es2015"]
}
```

#### addRuleForInlineCssModules

Inject CSS modules into the `head` tag using a `style` tag.  Add a rule to the `module.rules` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForInlineCssModules();
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

* `css-loader` - knows how to import and parse with CSS imports
* `style-loader` - takes CSS imports and adds them as a `style` tag in the HTML document

```unix
npm install --save-dev style-loader css-loader # for example
```

#### addRuleForExtractCssModules ( _cssName_ )

Extract CSS modules into a file.  Add a rule to the `module.rules` for babel.  For example,

```javascript
function buildConfig(config) {
  config.addRuleForExtractCssModules();
}
```

will push the following rule to `module.rules`.

```javascript
{
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader?modules&localIdentName=[path][name]_[local]_[hash:base64:5]'
  }),
  test: /\.css$/
}
```

and will push the following plugin to `plugins`

```javascript
new ExtractTextPlugin('[name].[contenthash].css')
```

There is a prerequisite to adding this to your config.  You need to install the css loader and extract text plugin.  For example,

* `css-loader` - knows how to import and parse with CSS imports
* `style-loader` - takes CSS imports and adds them as a `style` tag in the HTML document
* `extract-text-webpack-plugin` - associated with a loader and takes any text generated by the loader and save it to a file

```unix
npm install --save-dev css-loader style-loader extract-text-webpack-plugin # for example
```

#### addRuleForImages

Resize images and include small ones. Add a rule to the `module.rules` for babel.  For example,

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

* `image-webpack-loader` - resize the image
* `url-loader` - include small images as data, output large images as files

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
yarn add --dev html-webpack-plugin
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
function customize(config) {
  var SomeJsPlugin = require('some-js-plugin');

  config.module.rules.push({
    use: 'some-js-loader'
    test: /\.js$/
  });
  config.plugin.push(new SomeJsPlugin());
}

function buildConfig(config) {
  config.custom(customize);
}
```

#### addEnvironment

Add an environment to the window scope.

```javascript
function buildConfig(config) {
  config.addEnvironment();
}
```

For example, using `--env`.

```unix
webpack --env=production
```

or using `NODE_ENV`

```unix
NODE_ENV=production webpack
```

will add this plugin to `plugins` in the following way.

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': 'production'
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

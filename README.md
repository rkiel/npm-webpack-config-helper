# webpack-config-helper

Utility to make it easier to construct your webpack config.  It only supports the Webpack 2 config.

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

It is expected that you use this in your `webpack.config.js` file.

```javascript
const Helper = require('webpack-config-helper');

module.exports = new Helper()
  .addRuleForBabel()
  .addRuleForCssAndStyle()
  .echo()
  .exports()
```

## Summary

* new -- invoke the constructor to create minimal webpack config
* entry -- override the default entry point
* output -- override the default output
* addRuleForBabel -- add a rule to support Babel (NOTE: requires prerequisites)
* addRuleForCssAndStyle -- add a rule to support CSS and Style loaders (NOTE: requires prerequisites)
* addRuleForExtractCss -- add a rule to support extracting CSS into a file (NOTE: requires prerequisites)
* addRuleForImages -- add a rule to support images (NOTE: requires prerequisites)
* custom -- invoke callback to allow custom changes to the config object
* echo -- display the current state of the config object
* exports -- return the config  object

#### new

The constructor creates a minimal webpack configuration choosing defaults for `entry` and `output`.

```javascript
const Helper = require('webpack-config-helper');
new Helper();
```

will generate the following.

```javascript
{
  "entry": {
    "bundle": "./src/index.js"
  },
  "output": {
    "path": "/full/path/to/build",
    "filename": "[name].js"
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
new Helper().entry('app', './src/app.js');
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
new Helper().output('dest')
```

will update the config in the following way.

```javascript
{
  "output": {
    "path": "/full/path/to/dest",
    "filename": "[name].js"
  }
}
```

#### addRuleForBabel

Add a rule to the `module.rules` for Babel.  For example,

```javascript
new Helper().addRuleForBabel()
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
new Helper().addRuleForCssAndStyle()
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
new Helper().addRuleForExtractCss()
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
new Helper().addRuleForImages()
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

#### echo

Display the current state of the config.  For example,

```javascript
new Helper().addRuleForBabel().echo()
```

will display the config showing the `entry`, `output`, and `module.rules` for Babel.
You can display the config multiple times to see how it changes.  For example,

```javascript
new Helper().echo().addRuleForBabel().echo()
```

will display the config at two different points in time.


#### exports

Return the final state of the config. For example,

```javascript
module.exports = new Helper().addRuleForBabel().exports();
```


## LICENSE

MIT

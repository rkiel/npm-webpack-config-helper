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
  "entry": "./src/index.js",
  "output": {
    "path": "/full/path/to/build",
    "filename": "bundle.js"
  },
  "module": {
    "rules": []
  },
  "plugins": []
}
```

#### entry ( _path_ )

Override the default entry point.  For example,

```javascript
new Helper().entry('./src/app.js');
```

will update the config in the following way.

```javascript
{
  "entry": "./src/app.js"
}
```

#### output ( _directory_ , _filename_ )

Override the default output.  For example,

```javascript
new Helper().output('dest', 'app_bundle.js')
```

will update the config in the following way.

```javascript
{
  "output": {
    "path": "/full/path/to/dest",
    "filename": "app_bundle.js"
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

There is a prerequisite to adding this to your config.  You need to install the css and style loader modules.  For example,

```unix
npm install --save-dev style-loader css-loader # for example
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

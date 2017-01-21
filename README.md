# webpack-config-helper

Utility to make it easier to construct your webpack config

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

* init -- initialize a minimal config object
* addRuleForBabel -- add a rule to support Babel
* addRuleForCssAndStyle -- add a rule to support CSS and Style loaders
* custom -- invoke callback to allow custom changes to the config object
* echo -- display the current state of the config object
* exports -- return the config  object

## LICENSE

MIT

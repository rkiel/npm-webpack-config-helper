# webpack-config-helper

Utility to make it easier to construct your webpack config

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should
be installed as one of your project's `devDependencies`:

```
npm install --save-dev webpack-config-helper
```

## Usage

It is expected that you use this in your `webpack.config.js` file.

```javascript
const helper = require('webpack-config-helper');

const steps = [
  helper.addMinimum,
  helper.initForModuleRules,
  helper.initForPlugins,
  helper.addRuleForBabel,
  helper.addRuleForCssAndStyle
];

const config = helper.build(steps);

module.exports = config;
```

## LICENSE

MIT

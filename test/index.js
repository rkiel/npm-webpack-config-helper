var path = require('path');
var expect = require('chai').expect;
var Helper = require('../index');

describe('webpack-config-helper', function () {

  describe('init', function() {
    it('should add a default entry', function () {
      var helper = new Helper();

      expect(helper.exports()).to.eql({
        entry: {
          bundle: './src/index.js'
        },
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
    });

    it('should support to distinct instances', function () {
      var helper1 = new Helper().entry('begin', './src/begin.js');
      var helper2 = new Helper().entry('start', './src/start.js');

      expect(helper1.exports()).to.eql({
        entry: {
          begin: './src/begin.js'
        },
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
      expect(helper2.exports()).to.eql({
        entry: {
          start: './src/start.js'
        },
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
    });

  });

  describe('entry', function () {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should override the entry', function() {
      helper.entry('start', './src/start.js');
      expect(helper.exports().entry).to.eql({
        start: './src/start.js'
      });
      helper.entry('begin', './src/begin.js');
      expect(helper.exports().entry).to.eql({
        start: './src/start.js',
        begin: './src/begin.js'
      });
    });
  });

  describe('output', function () {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should override the ouput', function() {
      helper.output('dest', 'dest.js')
      expect(helper.exports().output).to.eql({
        path: path.resolve(process.cwd(), 'dest'),
        filename: '[name].js'
      });
    });
  });

  describe('addRuleForBabel', function() {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should add a rule for Babel', function() {
      var rules = helper.addRuleForBabel().exports().module.rules;

      expect(rules[0]).to.eql({
        use: 'babel-loader',
        test: /\.js$/,
        exclude: "/node_modules/"
      });
    });
  });

  describe('addRuleForCssAndStyle', function() {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should add a rule for CSS and Style', function() {
      var rules = helper.addRuleForCssAndStyle().exports().module.rules;

      expect(rules[0]).to.eql({
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      });
    });
  });

  describe('addRuleForExtractCss', function() {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should add a rule for CSS and ExtractText', function() {
      var exports = helper.addRuleForExtractCss().exports();
      var rules = exports.module.rules;
      var plugins = exports.plugins;

      expect(rules.length).to.eql(1);
      expect(plugins.length).to.eql(1);
    });
  });

  describe('addRuleForImages', function() {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should add a rule for images', function() {
      var rules = helper.addRuleForImages().exports().module.rules;

      expect(rules[0]).to.eql({
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 40000}
          },
          'image-webpack-loader'
        ]
      });
    });
  });

  describe('addCommonsChunk', function() {
    var helper;

    before(function () {
      helper = new Helper();
    })

    it('should add a CommonsChunkPlugin', function() {
      var exports = helper.addCommonsChunk('vendor').exports();
      var rules = exports.module.rules;
      var plugins = exports.plugins;

      expect(rules.length).to.eql(0);
      expect(plugins.length).to.eql(1);
    });
  });


});

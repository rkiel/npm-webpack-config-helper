var path = require('path');
var expect = require('chai').expect;
var Helper = require('../index');

describe('webpack-config-helper', function () {

  describe('init', function() {
    it('should add a default entry', function () {
      var config = new Helper();

      expect(config.exports()).to.eql({
        entry: './src/index.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
    });

    it('should add a default entry to an existing object', function () {
      var existingConfig = {
        entry: '.src/foo.js',
        fakeInput: 'fake.input'
      }
      var config = new Helper(existingConfig);

      expect(config.exports()).to.eql({
        fakeInput: 'fake.input',
        entry: './src/index.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
    });

    it('should add a default entry to an existing object', function () {
      var config1 = new Helper().entry('./src/begin.js');
      var config2 = new Helper().entry('./src/start.js');

      expect(config1.exports()).to.eql({
        entry: './src/begin.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
      expect(config2.exports()).to.eql({
        entry: './src/start.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, '..', 'build')
        },
        module: {
          rules: []
        },
        plugins: []
      });
    });

  });

});

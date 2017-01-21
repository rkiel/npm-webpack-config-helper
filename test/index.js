var path = require('path');
var expect = require('chai').expect;
var helper = require('../index');

describe('webpack-config-helper', function () {

  describe('init', function() {
    var config;

    before(function () {
      config = helper.init();
    })

    it('should add a default entry', function () {
      expect(config.exports().entry).to.equal('./src/index.js');
    });
    it('should add a default output', function () {
      expect(config.exports().output).to.eql({
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'bundle.js'
      });
    });
    it('should add module rules', function () {
      expect(config.exports().module.rules).to.eql([]);
    });
    it('should add plugins', function () {
      expect(config.exports().plugins).to.eql([]);
    });

  });

});

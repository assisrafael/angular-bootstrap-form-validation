var fs = require('fs');
var changelog = require('conventional-changelog');
var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var pkg = require('./package.json');

gulp.task('changelog', function(done) {
	var options = {
		reporitory: pkg.homepage,
		version: pkg.version,
		file: 'CHANGELOG.md'
	};

	var filePath = path.join(__dirname, options.file);
	changelog(options, function(err, log) {
		fs.writeFileSync(filePath, log);
	});
});

gulp.task('test', function(done) {
	var karmaConfig = {
		singleRun: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

gulp.task('test-watch', function(done) {
	var karmaConfig = {
		singleRun: false,
		autoWatch: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

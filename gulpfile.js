var fs = require('fs');
var changelog = require('conventional-changelog');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var path = require('path');
var pkg = require('./package.json');

gulp.task('changelog', function() {
	var options = {
		reporitory: pkg.homepage,
		version: pkg.version,
		file: 'CHANGELOG.md'
	};

	var filePath = path.join(__dirname, options.file);
	changelog(options, function(err, log) {
		if (err) {
			throw err;
		}

		fs.writeFileSync(filePath, log);
	});
});

gulp.task('jshint', function() {
	gulp.src([
		'src/**/*.js',
		'config/karma.conf.js',
		'gulpfile.js'
	])
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(require('jshint-summary'), {
		fileColCol: ',bold',
		positionCol: ',bold',
		codeCol: 'green,bold',
		reasonCol: 'cyan'
	}))
	.pipe(jshint.reporter('fail'));
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

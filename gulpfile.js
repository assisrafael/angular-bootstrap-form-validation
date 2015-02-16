var fs = require('fs');
var changelog = require('conventional-changelog');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var path = require('path');
var pkg = require('./package.json');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var insert = require('gulp-insert');
var argv = require('minimist')(process.argv.slice(2));
var bump = require('gulp-bump');

var VERSION = argv.version || pkg.version;

var config = {
	banner:
		'/*!\n' +
		' * ' + pkg.name + '\n' +
		' * ' + pkg.homepage + '\n' +
		' * @license MIT\n' +
		' * v' + VERSION + '\n' +
		' */\n',
};

gulp.task('changelog', function() {
	var options = {
		reporitory: pkg.homepage,
		version: VERSION,
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
	return gulp.src([
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

gulp.task('build', ['jshint'], function() {
	gulp.src('src/**/*.js')
	.pipe(filterNonCodeFiles())
	.pipe(ngAnnotate())
	.pipe(insert.prepend(config.banner))
	.pipe(gulp.dest('dist'))
	.pipe(uglify({
		preserveComments: 'some'
	}))
	.pipe(rename({
		extname: '.min.js'
	}))
	.pipe(gulp.dest('dist'));
});

function filterNonCodeFiles() {
	return filter(function(file) {
		return !/\.json|\.spec.js/.test(file.path);
	});
}

gulp.task('version-bump', function() {
	gulp.src([
		'./bower.json',
		'./package.json'
	])
	.pipe(bump({
		version: VERSION
	}))
	.pipe(gulp.dest('./'));
});

gulp.task('release', ['version-bump', 'changelog']);

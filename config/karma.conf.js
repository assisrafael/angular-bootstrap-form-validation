module.exports = function(config) {
	var configuration = {
		basePath: __dirname + '/..',
		frameworks: ['jasmine'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'src/*.js'
		],
		port: 9876,
		reporters: ['progress', 'coverage'],
		preprocessors: {
			'src/form-validation.js': ['coverage']
		},
		coverageReporter: {
			dir: 'coverage',
			reporters: [{
				type: 'lcov',
				subdir: 'report-lcov'
			}, {
				type: 'html',
				subdir: 'report-html'
			}]
		},
		colors: true,
		autoWatch: false,
		singleRun: false,
		browsers: ['Chrome'],
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
	};

	if(process.env.TRAVIS){
		configuration.browsers = ['Chrome_travis_ci'];

		configuration.reporters.push('coveralls');
	}

	config.set(configuration);
};

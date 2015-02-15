module.exports = function(config) {
	config.set({
		basePath: __dirname + '/..',
		frameworks: ['jasmine'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'src/*.js'
		],
		port: 9876,
		reporters: ['progress'],
		colors: true,
		autoWatch: false,
		singleRun: false,
		browsers: ['Chrome']
	});
};

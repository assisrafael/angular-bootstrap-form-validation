'use strict';

/*
  This module was based http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/
*/

angular.module('formValidation', [])
.directive('fvSubmit', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		require: ['fvSubmit', '?form'],
		controller: [function () {
			this.attempted = false;

			this.setAttempted = function() {
				this.attempted = true;
			};
		}],
		link: function(scope, formElement, attributes, controllers) {
			var submitController = controllers[0];
			var formController = (controllers.length > 1) ? controllers[1] : null;

			var fn = $parse(attributes.fvSubmit);

			formElement.bind('submit', function () {
				submitController.setAttempted();
				if (!scope.$$phase) {
					scope.$apply();
				}

				if (!formController.$valid) {
					return false;
				}

				scope.$apply(function() {
					fn(scope, {$event:event});
				});
			});
		}
	};
}])
.directive('fvHasError', [function () {
	return {
		restrict: 'A',
		require: '^fvSubmit',
		scope: {
			formField: '=fvHasError'
		},
		link: function (scope, element, attrs, fvSubmitCtrl) {
			scope.$watch(function(){
				return fvSubmitCtrl.attempted && scope.formField.$invalid;
			}, function(needsAttention) {
				if(needsAttention) {
					element.addClass('has-error');
				} else {
					element.removeClass('has-error');
				}
			});
		}
	};
}])
.directive('fvErrorMessages', [function () {
	return {
		restrict: 'E',
		templateUrl: 'templates/form-validation/error-messages.html',
		scope: {
			formField: '=field',
			min: '=min',
			max: '=max',
			minlength: '=minlength',
			required: '=required'
		}
	};
}])
.run(['$templateCache', function($templateCache) {
	$templateCache.put('templates/form-validation/error-messages.html',
		'<div class="error" ng-show="formField.$invalid">' +
		'	<small class="error" ng-show="formField.$error.required">{{required || \'Campo de preenchimento obrigatório.\'}}</small>' +
		'	<small class="error" ng-show="formField.$error.min">Valor mínimo: {{min || \'?\'}}.</small>' +
		'	<small class="error" ng-show="formField.$error.max">Valor máximo: {{max || \'?\'}}.</small>' +
		'	<small class="error" ng-show="formField.$error.minlength">Tamanho mínimo: {{minlength || \'?\'}} caracteres.</small>' +
		'	<small class="error" ng-show="formField.$error.email">Email inválido.</small>' +
		'</div>'
	);
}]);
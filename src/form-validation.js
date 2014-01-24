'use strict';

/*
  This module was based http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/
*/

angular.module('ui.bootstrap.validation', [])
.directive('uiValidationSubmit', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		require: ['uiValidationSubmit', '?form'],
		controller: [function () {
			this.attempted = false;

			this.setAttempted = function() {
				this.attempted = true;
			};
		}],
		link: function(scope, formElement, attrs, controllers) {
			var submitController = controllers[0];
			var formController = (controllers.length > 1) ? controllers[1] : null;

			var fn = $parse(attrs.uiValidationSubmit);

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
.directive('uiValidationShowErrors', [function () {
	return {
		restrict: 'A',
		require: [
			'^form',
			'^?uiValidationSubmit'
		],
		scope: { },
		link: function (scope, element, attrs, controllers) {
			if(!element.hasClass('form-group')) {
				throw 'ui-validation-show-errors element requires \'form-group\' class';
			}

			var formCtrl = controllers[0];

			if(!formCtrl) {
				throw 'ui-validation-show-errors requires a controller associated to this form';
			}
			
			var submitCtrl = (controllers.length > 1) ? controllers[1] : null;
			
			var inputElement = element[0].querySelector('input[name],select[name],textarea[name]');

			if(!inputElement)	{
				throw 'ui-validation-show-errors requires a child input/select/textarea element with a \'name\' attribute';
			}

			var fieldCtrl = formCtrl[inputElement.name];

			scope.$watch(function(){
				return fieldCtrl.$invalid && (!submitCtrl || submitCtrl.attempted);
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
.directive('uiValidationErrorMessages', ['$compile', function ($compile) {
	return {
		restrict: 'E',
		require: '^form',
		templateUrl: 'templates/form-validation/error-messages.html',
		scope: {},
		link: function(scope, element, attrs, formCtrl) {
			var formGroup = element.parent();
			var inputElement = formGroup[0].querySelector('input[name],select[name],textarea[name]');

			if(!inputElement)	{
				throw 'ui-validation-error-messages requires a sibling input/select/textarea element with a \'name\' attribute';
			}

			scope.fieldCtrl = formCtrl[inputElement.name];
			var angularElement = angular.element(inputElement);
			scope.minlength = angularElement.attr('ng-minlength');
			scope.min = angularElement.attr('min');
			scope.max = angularElement.attr('max');

			scope.errorMessages = {
				'required': 'Campo de preenchimento obrigatório',
				'min': 'Valor mínimo: {{min}}',
				'max': 'Valor mínimo: {{max}}',
				'minlength': 'Tamanho mínimo: {{minlength}} caracteres',
				'email': 'Email inválido',
			};

			$compile(formGroup[0].querySelector('.help-block'))(scope);
		}
	};
}])
.directive('uiCustomErrorMessage', [function () {
	return {
		restrict: 'E',
		link: function (scope, iElement, iAttrs) {
			
		}
	};
}])
.run(['$templateCache', function($templateCache) {
	$templateCache.put('templates/form-validation/error-messages.html',
		'<div class="help-block" ng-show="fieldCtrl.$invalid">' +
		'	<small ng-repeat="(errorType, errorValue) in fieldCtrl.$error" ng-show="errorValue">{{errorMessages[errorType]}}</small>' +
		'</div>'
	);
}]);
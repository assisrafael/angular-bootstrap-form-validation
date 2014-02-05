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

			formElement.bind('submit', function (event) {
				submitController.setAttempted();
				if (!scope.$$phase) {
					scope.$apply();
				}

				if (!formController.$valid) {
					return false;
				}

				scope.$apply(function() {
					fn(scope, {
						$event: event
					});
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
.value('ErrorMessages', {
	'email': 'Invalid email',
	'max': 'Maximum value: ',
	'maxlength': 'Maximum length: ',
	'min': 'Minimum value: ',
	'minlength': 'Minimum length: ',
	'required': 'This field cannot be blank',
	'unique': 'This field does not allow duplicated values'
})
.factory('ErrorMessagesWithAttrs', ['ErrorMessages', function (ErrorMessages) {
	return {
		getMessages: function(element) {
			return {
				'email': ErrorMessages.email,
				'max': ErrorMessages.max + element.attr('max'),
				'maxlength': ErrorMessages.maxlength + element.attr('ng-maxlength'),
				'min': ErrorMessages.min + element.attr('min'),
				'minlength': ErrorMessages.minlength + element.attr('ng-minlength'),
				'required': ErrorMessages.required,
				'unique': ErrorMessages.unique
			};
		}
	};
}])
.directive('uiValidationErrorMessages', ['ErrorMessagesWithAttrs',
	function (ErrorMessagesWithAttrs) {
		return {
			restrict: 'E',
			require: '^form',
			replace: true,
			templateUrl: 'templates/form-validation/error-messages.html',
			scope: {},
			link: function(scope, element, attrs, formCtrl) {
				var formGroup = element.parent();
				var inputElement = formGroup[0].querySelector('input[name],select[name],textarea[name]');

				if(!inputElement)	{
					throw 'ui-validation-error-messages requires a sibling input/select/textarea element with a \'name\' attribute';
				}

				var angularElement = angular.element(inputElement);
				scope.fieldCtrl = formCtrl[inputElement.name];
				scope.errorMessages = ErrorMessagesWithAttrs.getMessages(angularElement);
			}
		};
	}
])
.directive('uiCustomErrorMessage', [function () {
	return {
		restrict: 'E',
		replace: true,
		link: function () {
			console.log('Not implemented yet!');
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
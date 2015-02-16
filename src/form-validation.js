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
			var formController = controllers[1] || null;

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

			var submitCtrl = controllers[1] || null;

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
.directive('uiValidationErrorMessages', ['ErrorMessages', '$parse',
	function (ErrorMessages, $parse) {
		var normalizeAttrName = function(attr) {
			return attr.replace(/^(x[\:\-_]|data[\:\-_]|ng[\:\-_])/i, '');
		};

		return {
			restrict: 'AE',
			require: '^form',
			replace: true,
			template:
				'<div class="ui-validation help-block" ng-show="fieldCtrl.$invalid">' +
					'	<small ng-repeat="(errorType, errorValue) in fieldCtrl.$error" ng-show="fieldCtrl.$error[errorType]">{{errorMessages[errorType]}} <span ng-bind="{{errorType}}"></span></small>' +
				'</div>',
			scope: {},
			link: function(scope, element, attrs, formCtrl) {
				var formGroup = element.parent();
				var inputElement = formGroup[0].querySelector('input[name],select[name],textarea[name]');

				if(!inputElement)	{
					throw 'ui-validation-error-messages requires a sibling input/select/textarea element with a \'name\' attribute';
				}

				var angularElement = angular.element(inputElement);

				scope.fieldCtrl = formCtrl[inputElement.name];
				angular.forEach(angularElement[0].attributes, function(attr) {
					//ngRequired value cannot appear in error message
					if(/^(ng-required)/.test(attr.name)) {
						return;
					}

					var attrName = normalizeAttrName(attr.name);
					var attrValue = attr.nodeValue;

					if(ErrorMessages.hasOwnProperty(attrName) && attrValue.length > 0) {
						scope[attrName] = attrValue;

						var canBeAModel = /^[A-Za-z]/.test(attr.nodeValue);

						if(canBeAModel) {
							scope[attrName] = $parse(attrValue)(scope.$parent);

						 	scope.$parent.$watch(attr.nodeValue, function(newValue) {
								scope[attr.name] = newValue;
						 	});
						}
					}
				});

				scope.errorMessages = angular.copy(ErrorMessages);
			}
		};
	}
])
.directive('uiCustomErrorMessage', [function () {
	return {
		restrict: 'E',
		replace: true,
		link: function () {
			throw new Error('Not implemented yet!');
		}
	};
}]);

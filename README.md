angular-bootstrap-form-validation
=================================

AngularJS directives for Twitter Bootstrap form validation

How to use
----------

- Include the module in your angular app:


		angular.module('app', ['formValidation']);


- Include the directives in your form


		<form name="someForm" novalidate fv-submit="save()">
			<div class="form-group" fv-has-error="someForm.someField">
				<label for="someField" class="control-label">Some field</label>
				<input type="text" name="someField" required class="form-control" ng-model="someField">
				<fv-error-messages field="someForm.someField">
			</div>
			<button type="submit" class="btn btn-primary" ng-disabled="someForm.$pristine">Save</button>
		</form>

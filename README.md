angular-bootstrap-form-validation
=================================

AngularJS directives for Twitter Bootstrap form validation.

Installation
------------

With Bower:

```
bower install --save angular-bootstrap-form-validation
```

How to use
----------

1. Include the module ```ui.bootstrap.validation``` in your angular app:

2. Include the directives in your form

```html
<form name="someForm" novalidate ui-validation-submit="save()">
	<div class="form-group" ui-validation-show-erros>
		<label for="someField" class="control-label">Some field</label>
		<input type="text" name="someField" required class="form-control" ng-model="someField">
		<ui-validation-error-messages>
			<ui-custom-error-message error="required">This field cannot be empty</ui-custom-error-message>
		</ui-validation-error-messages>
	</div>
	<button type="submit" class="btn btn-primary" ng-disabled="someForm.$pristine">Save</button>
</form>
```
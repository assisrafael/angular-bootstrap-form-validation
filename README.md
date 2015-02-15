# angular-bootstrap-form-validation [![Build Status](https://travis-ci.org/assisrafael/angular-bootstrap-form-validation.svg)](https://travis-ci.org/assisrafael/angular-bootstrap-form-validation) [![Coverage Status](https://coveralls.io/repos/assisrafael/angular-bootstrap-form-validation/badge.svg)](https://coveralls.io/r/assisrafael/angular-bootstrap-form-validation)

AngularJS directives for Twitter Bootstrap form validation.

## Installation

With Bower:

```
bower install --save angular-bootstrap-form-validation
```

## How to use

1. Include the module ```ui.bootstrap.validation``` in your angular app:

2. Include the directives in your form

```html
<form name="someForm" novalidate ui-validation-submit="save()">
	<div class="form-group" ui-validation-show-errors>
		<label for="someField" class="control-label">Some field</label>
		<input type="text" name="someField" required class="form-control" ng-model="someField">
		<ui-validation-error-messages>
	</div>
	<button type="submit" class="btn btn-primary" ng-disabled="someForm.$pristine">Save</button>
</form>
```

3. (optional) Use localized error messages (only pt-br available):

```html
<script src="form-validation-locale_pt-br.js"></script>
```

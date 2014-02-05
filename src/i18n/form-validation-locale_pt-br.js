'use strict';

angular.module('ui.bootstrap.validation')
.value('ErrorMessages', {
	'email': 'Email inválido',
	'max': 'Valor máximo: ',
	'maxlength': 'Tamanho máximo: ',
	'min': 'Valor mínimo: ',
	'minlength': 'Tamanho mínimo: ',
	'required': 'Campo de preenchimento obrigatório',
	'unique': 'Este campo não aceita valores repetidos'
});
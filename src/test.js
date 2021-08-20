const validate = require('./index');

const result = validate( {phone: "(62)99940-4467"}, [{name: "phone", custom: "phone", message: {custom: "{value} não é um número de celular válido"} }]);

console.log(result);

const validate = require('./index');

const result = validate( {email: "@gmail.com"}, [{name: "email", custom: "email", message: {custom: "{value} não é um número de celular válido"} }]);

console.log(result);

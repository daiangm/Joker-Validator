const validate = require('./index');

const result = validate( {email: "daian"}, [{name: "email", customValidation: "email", message: {customValidation: "O valor do campo {field} precisa ser um e-mail"} }]);

console.log(result);

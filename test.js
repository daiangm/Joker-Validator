const validate = require('./index');

result = validate( {phone: null}, [{name: "phone", dataType: "number", message: {dataType: "O valor do campo {field} precisa ser um número", } }]);
console.log(result);

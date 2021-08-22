const validate = require('./index');

const result = validate({ date: "2021-08-31" }, [{ name: "date", dataType: "date", range: { min: "2021-08-31", max: "2021-08-01" } }]);

console.log(result);

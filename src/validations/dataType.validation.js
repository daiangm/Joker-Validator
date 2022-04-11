function valDataType(rulesConfig, field, value) {

    let _validate = true, _message = "Ok"

    switch (rulesConfig.toLowerCase()) {

        case "array":
            if (Array.isArray(value) === false) {
                _validate = false;
                _message = `O valor de '${field}' não é um Array`;
            }
            break;

        case "date":
            if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
                _validate = false;
                _message = `O valor de '${field}' não corresponde à uma data válida`;
            }
            break;

        default:
            if ((typeof value).toLowerCase() !== rulesConfig.toLowerCase()) {
                _validate = false;
                _message = `O valor de '${field}' não corresponde ao tipo de dado exigido`;
            }
            break;
    }

    return { validate: _validate, message: _message }

}

module.exports = {valDataType}
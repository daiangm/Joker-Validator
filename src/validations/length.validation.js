function valLength(rulesConfig, field, value) {

    let _validate = true, _message = "Ok";

    if (rulesConfig.min > 0) {
        if (value.length < rulesConfig.min) {
            _validate = false;
            _message = `O valor de '${field}' não possui a quantidade mínima de caracteres exigida`;
        }
    }

    if (rulesConfig.max > 0) {
        if (value.length > rulesConfig.max) {
            _validate = false;
            _message = `O valor de '${field}' possui quantidade de caracteres/ítens maior que o máximo permitido`
        }
    }

    return { validate: _validate, message: _message }

}

module.exports = {valLength}
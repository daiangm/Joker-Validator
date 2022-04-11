function valRegex(rulesConfig, field, value, required) {

    let _validate = true, _message = "Ok";

    const matches = typeof value === "string" ? value.match(rulesConfig) : null;

    if (!matches) {
        _validate = false;
        _message = `O valor do campo '${field}' não corresponde ao formato de dado exigido`
    }

    return { validate: _validate, message: _message }

}

module.exports = {valRegex}
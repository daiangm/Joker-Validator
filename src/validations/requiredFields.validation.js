/**
 * Verifica se os campos configurados como preenchimento obrigatório foram preenchidos
 * @param {[string]} rulesArray 
 * @param {Object} rules 
 * @returns 
 */
 function verifyRequiredFields(rulesArray, rules) {

    let _validate = true;
    let _message;

    if (rulesArray.length > 0) {
        rulesArray.forEach((item) => {
            if (rules[item].required) {
                _message = `É obrigatório atribuir valor ao campo '${item}'`;

                if (typeof rules[item].message === "object") {
                    if (typeof rules[item].message.required === "string" || rules[item].message.custom === "string") {
                        _message = setErrorMessage({ field: item, message: rules[item].message.required || rules[item].message.custom });
                    }
                }

                return _validate = false;
            }
        });
    }

    return _validate ? { validate: _validate } : { validate: _validate, message: _message }

}

module.exports = { verifyRequiredFields }
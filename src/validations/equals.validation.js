function valEquals(rulesConfig, valueToCheck, value, field) {

    if (!valueToCheck || value !== valueToCheck) {
        return { validate: false, message: `O valor do campo '${field}' é diferente do valor de '${rulesConfig}''` }
    }

    return { validate: true, message: `Ok` }

}

module.exports = {valEquals}
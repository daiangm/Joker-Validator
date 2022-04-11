function valDataType(rulesConfig, field, value) {

    switch (rulesConfig.toLowerCase()) {

        case "array":
            if (Array.isArray(value) === false) {
                return { validate: false, message: `O valor de '${field}' não é um Array` }
            }
            break;

        case "date":
            if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
                return { validate: false, message: `O valor de '${field}' não corresponde à uma data válida` }
            }
            break;

        default:
            if ((typeof value).toUpperCase() !== rulesConfig.toUpperCase()) {
                return { validate: false, message: `O valor de '${field}' não corresponde ao tipo de dado exigido` }
            }
            break;
    }

    return { validate: true, message: `Ok` }

}

function valList(rulesConfig, field, value) {

    if (!(Array.isArray(rulesConfig))) {
        console.error(`A propriedade 'list' precisa ser um Array`);
        return { validate: false };
    }

    let listValueIndex = rulesConfig.findIndex((listValue) => {
        return value === listValue;
    });

    if (listValueIndex < 0) {
        return { validate: false, msg: `O valor '${value}' em '${field}' não está presente na lista de valores permitidos` }
    }

    return { validate: true, message: "Ok" }

}

function valLength(rulesConfig, field, value) {

    if (rulesConfig.min > 0) {
        if (value.length < rulesConfig.min) {
            return { validate: false, message: `O valor de '${field}' não possui a quantidade mínima de caracteres exigida` }
        }
    }

    if (rulesConfig.max > 0) {
        if (value.length > rulesConfig.max) {
            return { validate: false, message: `O valor de '${field}' possui quantidade de caracteres/ítens maior que o máximo permitido` }
        }
    }

    return { validate: true, message: `Ok` }

}

function valRange(rulesConfig, field, value) {

    let rangeMin, rangeMax;
    let dataToRangeValidate;

    const conditions = {
        1: {
            rule: !rulesConfig || typeof rulesConfig !== "object",
            message: `A propriedade 'range' precisa ser necessariamente um Objeto`
        },
        2: {
            rule: !rulesConfig.min && !rulesConfig.max,
            message: `Para utilizar a propriedade 'range', as propriedades 'min' e/ou 'max' devem estar presentes no objeto com atribuição de número ou data`
        }
    }

    if (conditions[1].rule || conditions[2].rule) {
        console.error(conditions[1].rule ? conditions[1].message : conditions[2].message)
        return { validate: false }
    }

    const isNaNDate = (dateValue) => isNaN(Date.parse(dateValue));

    const validations = {
        "string": {
            first: {
                verify: {
                    action: () => isNaNDate(value),
                    message: `Valor do campo '${field}' não corresponde à uma data válida`
                }
            },
            actions: {
                rangeMin: {
                    condition: rulesConfig.min ? true : false,
                    verify: {
                        action: () => isNaNDate(rulesConfig.min),
                        message: `Valor de data inválida em 'min' para utilização da propriedade 'range'`
                    },
                    setValue: () => { rangeMin = Date.parse(rulesConfig.min) }
                },
                rangeMax: {
                    condition: rulesConfig.max ? true : false,
                    verify: {
                        action: () => isNaNDate(rulesConfig.max),
                        message: `Valor de data inválida em 'max' para utilização da propriedade 'range'`
                    },
                    setValue: () => { rangeMax = Date.parse(rulesConfig.max) }
                }
            },
            valueToRefuse: true,
            allowResult: () => { dataToRangeValidate = Date.parse(value) }
        },
        "number": {
            first: {
                verify: {
                    action: () => { typeof rulesConfig.min !== "number" && typeof !rulesConfig.max !== "number" },
                    message: `Propriedade 'range' necessita pelo menos um número para definir o intervalo. Propriedades 'min' e/ou 'max'`
                }
            },
            allowResult: () => {
                rangeMin = rulesConfig.min;
                rangeMax = rulesConfig.max;
                dataToRangeValidate = value;
            }
        }
    }

    const validation = validations[typeof value]

    if (validation.first) {
        if (validation.first.verify.action()) return { validate: false, message: validation.first.verify.message };
    }

    if(validation.actions){
        for (let val in validation.actions) {

            if (validation.actions[val].condition) {
    
                if (validation.actions[val].verify.action() === validation.valueToRefuse) {
                    console.error(validation.actions[val].verify.message);
                    return { validate: false }
                }
    
                validation.actions[val].setValue();
    
            }
    
        }
    }

    validation.allowResult();

    if (rangeMin > rangeMax) {
        let tempRangeMin = rangeMax;
        rangeMax = rangeMin;
        rangeMin = tempRangeMin;
    }

    if (dataToRangeValidate < rangeMin) {
        return { validate: false, message: `O valor de ${field} necessita ser maior ou igual a ${rulesConfig.min}` }
    }

    if (dataToRangeValidate > rangeMax) {
        return { validate: false, message: `O valor de ${field} necessita ser menor ou igual a ${rulesConfig.max}` }
    }

    return { validate: true, message: `Ok` };

}

function valRegex(rulesConfig, field, value, required) {

    let matches = typeof value === "string" ? value.match(rulesConfig) : null;

    if (!matches) {
        return { validate: false, message: `O valor do campo '${field}' não corresponde ao formato de dado exigido` }
    }

    return { validate: true, message: `Ok` }

}

function valEquals(rulesConfig, valueToCheck, value, field) {

    if (!valueToCheck || value !== valueToCheck) {
        return { validate: false, message: `O valor do campo '${field}' é diferente do valor de '${rulesConfig}''` }
    }

    return { validate: true, message: `Ok` }

}

/**
 * 
 * @param {[string]} rulesArray 
 * @param {Object} rules 
 * @returns 
 */
function verifyRequiredFields(rulesArray, rules) {

    let validated = true;
    let msg;

    if (rulesArray.length > 0) {
        rulesArray.forEach((item) => {
            if (rules[item].required) {
                msg = `É obrigatório atribuir valor ao campo '${item}'`;

                if (typeof rules[item].message === "object") {
                    if (typeof rules[item].message.required === "string" || rules[item].message.custom === "string") {
                        msg = setErrorMessage({ field: item, message: rules[item].message.required || rules[item].message.custom });
                    }
                }

                return validated = false;
            }
        });
    }

    return validated ? { validate: validated } : { validate: validated, message: msg }

}

module.exports = { valDataType, valLength, valList, valRange, valRegex, valEquals, verifyRequiredFields }
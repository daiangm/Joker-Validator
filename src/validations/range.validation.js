/**
 * Validação de intervalos
 * @param {object} rulesConfig Objeto de configuração das regras de validação de intervalo
 * @param {Date | number} rulesConfig.min Configuração de Valor Mínimo
 * @param {Date | number} rulesConfig.max Configuração de Valor Máximo
 * @param {string} field Nome do campo
 * @param {Date | number} value Valor do campo
 * @returns {{validate: boolean, message: string}}
 */
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

    const config = {
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

    const isNaNDate = (dateValue) => isNaN(Date.parse(dateValue));

    const validation = config[typeof value];

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

    let validated = true, msg = "Ok"

    if (dataToRangeValidate < rangeMin) {
        validated =  false
        msg = `O valor de ${field} necessita ser maior ou igual a ${rulesConfig.min}`;
    }

    if (dataToRangeValidate > rangeMax) {
        validated = false;
        msg =  `O valor de ${field} necessita ser menor ou igual a ${rulesConfig.max}`;
    }

    return { validate: validated, message: msg };

}

module.exports = {valRange}
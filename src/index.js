/**
 * @file JSON Schema Validator - Documentation Language: Brazilian Portuguese
 * @author Daian Gouveia Morato <daiangm@gmail.com>
 * @author Caroline Camelo <>
 * @copyright Daian Gouveia Morato 2021
 * @tutorial https://github.com/daiangm/json-validator-BR 
*/

module.exports = validate;

"use strict";

/** @description Valida se os valores de campos de preenchimento obrigatório foram declarados
 * @example validateData({})
 * @param { {any} } data Objeto que contenha os nomes dos campos como chaves e seus respectivos valores a serem validados. Ex: { "função": "Validação" }
 * @param {Object} rules Objeto contendo os parâmetros de validação dos dados enviados no argumento 'data'
 * @param {string} rules.name Nome da chave/campo do Objeto JSON em 'data' a ser validada pela função
 * @param { "string" | "number" | "date" | "boolean" | "object" | "array" =} rules.dataType Tipo de dado esperado do valor do campo definido na propriedade 'name'
 * @param {[string | number]=} rules.list Utilize esta propriedade para definir uma lista de valores para validação do campo definido na propriedade 'name'
 * @param {{min: number, max: number}=} rules.len Utilize as propriedades "min" e "max" para definir a quantidade mínima e máxima de caracteres / itens
 * @param {{min: number, max: number}=} rules.range Utilize as propriedades "min" e "max" para definir o intervalo (Validação ocorre apenas para valores como números e datas)
 * @param {boolean=} rules.required Define se o campo possui preenchimento obrigatório
 * @param {RegExp=} rules.regex Expressão regular para validação do valor do campo definido na propriedade 'name'
 * @param {string=} rules.custom Validação de valores personalizado conforme arquivo custom.validation.js
 * @param {object} rules.message Propriedade para personalizar a mensagem de erro para cada tipo de validação. Na string, utilize {field} para aparecer o nome do campo, {value} para aparecer o valor invalidado
 * @param {string=} rules.message.dataType Propriedade para personalizar a mensagem de erro relacionada à validação de tipo de dados. Na string, utilize {dataType} para aparecer na mensagem o tipo de dados configurado para esta validação
 * @param {string=} rules.message.list Propriedade para personalizar a mensagem de erro relacionada à validação de valores permitidos. Na string, utilize {list} para aparecer na mensagem a lista de valores configurada para esta validação
 * @param {string=} rules.message.len Propriedade para personalizar a mensagem de erro relacionada à validação de quantidade mínima e máxima de caracteres / itens. Na string, utilize {len[min]} para aparecer na mensagem o valor mínimo configurado para esta validação e {len[max]} para o valor máximo
 * @param {string=} rules.message.range Propriedade para personalizar a mensagem de erro relacionada à validação de intervalo permitido. Na string, utilize {range[min]} para aparecer na mensagem o valor mínimo e {range[max]} para aparecer o valor máximo configurado para esta validação
 * @param {string=} rules.message.regex Propriedade para personalizar a mensagem de erro relacionada à validação através de uma expressão regular.
 * @param {string=} rules.message.required Propriedade para personalizar a mensagem de erro relacionada à validação de campos obrigatórios.
 * @param {[string]=} allowedFields Array de Strings contendo os nomes dos Campos permitidos para a requisição
 * @return {{validate: true|false, message: string}} validate: True - Campos e Valores Validados / False - Campos e/ou Valores Inválidos
*/
function validate(data, rules, allowedFields){

    let result;

    try{
        result = validateData(data, rules, allowedFields)
    }
    catch(err){
        console.error(err);
        return {validate: false, message: "Ocorreu um erro desconhecido na tentativa de validação dos dados."}
    }

    return result;

}

const customValidation = require('../custom.validation');

function validateData(data, rules, allowedFields) {

    if (typeof rules !== "object" || typeof data !== "object") {
        console.error("validateData: Um dos argumentos obrigatórios na função não foi declarado");
        return false;
    }

    let availableFieldIndex;
    let key;
    let rulesObj;
    let r;
    let validated = true;
    let msg = "Ok";

    const rulesArray = Object.getOwnPropertyNames(rules);

    for (key in data) {

        if ((Array.isArray(allowedFields))) {
            if (allowedFields.length > 0) {

                availableFieldIndex = allowedFields.findIndex((fieldName) => {
                    return fieldName === key;
                });

                if (availableFieldIndex < 0) {
                    console.error(`validate: '${key}' não é um campo válido para requisição efetuada`);
                    return { validate: false, message: `'${key}' não é um campo válido para requisição efetuada` };
                }
            }
        }

        rulesObj = rules[key];

        if (!rulesObj) {
            continue;
        }

        if (rulesObj.custom) {

            if (typeof customValidation[rulesObj.custom] !== "object") {
                console.error(`Não há validação personalizada com o nome '${rulesObj.custom}'`);
                return { validate: false };
            }
            
            rulesObj = Object.assign(customValidation[rulesObj.custom], rulesObj);

        }

        for(r in rulesObj) {

            switch (r.toUpperCase()) {
                case "LIST":
                    if (!(Array.isArray(rulesObj[r]))) {
                        console.error(`A propriedade 'list' precisa ser um Array`);
                        return { validate: false };
                    }

                    let listValueIndex = rulesObj[r].findIndex((listValue) => {
                        return data[key] === listValue;
                    });

                    if (listValueIndex < 0) {
                        validated = false;
                        msg = `O valor '${data[key]}' em '${key}' não está presente na lista de valores permitidos`;
                    }
                    break;

                case "DATATYPE":

                    if (rulesObj[r].toUpperCase() === "ARRAY") {
                        if (Array.isArray(data[key]) === false) {
                            validated = false;
                            msg = `O valor de '${key}' não é um Array`;
                        }
                    }
                    else if (rulesObj[r].toUpperCase() === "DATE") {

                        if (!(data[key] instanceof Date) && (typeof data[key] !== "string" || isNaN(Date.parse(data[key])))) {
                            validated = false;
                            msg = `O valor de '${key}' não corresponde à uma data válida`;
                        }
                    }
                    else if ((typeof data[key]).toUpperCase() !== rulesObj[r].toUpperCase()) {
                        validated = false;
                        msg = `O valor de '${key}' não corresponde ao tipo de dado exigido`;
                    }
                    break;

                case "LEN":
                    if (rulesObj[r].min > 0) {
                        if (data[key].length < rulesObj[r].min) {
                            validated = false;
                            msg = `O valor de '${key}' não possui a quantidade mínima de caracteres exigida`;
                        }
                    }
                    if (rulesObj[r].max > 0) {
                        if (data[key].length > rulesObj[r].max) {
                            validated = false;
                            msg = `O valor de '${key}' possui quantidade de caracteres/ítens maior que o máximo permitido`;
                        }
                    }
                    break;

                case "RANGE":

                    let rangeMin;
                    let rangeMax;
                    let dataToRangeValidate;

                    if (!rulesObj[r].min || !rulesObj[r].max) {
                        console.error(`Para utilizar a propriedade 'range', as propriedades 'min' e 'max' devem estar presentes no objeto com atribuição de número ou data`)
                        return { validate: false }
                    }

                    if (typeof data[key] === "string") {

                        if (isNaN(Date.parse(data[key]))) {
                            console.error(`Valor do campo ${key} não corresponde à um data válida para utilização da validação 'range'`);
                            return { validate: false };
                        }
                        else if (isNaN(Date.parse(rulesObj[r].min)) || isNaN(Date.parse(rulesObj[r].max))) {
                            console.error(`Valor de data inválida para utilização da propriedade 'range'`);
                            return { validate: false };
                        }
                        else {
                            rangeMin = Date.parse(rulesObj[r].min);
                            rangeMax = Date.parse(rulesObj[r].max);
                            dataToRangeValidate = Date.parse(data[key]);
                        }
                    }
                    else if(typeof data[key] === "number"){

                        if (typeof rulesObj[r].min !== "number" || typeof !rulesObj[r].max !== "number") {
                            console.error(`Propriedade 'range' necessita ter dois números para definir o intervalo. Propriedades 'min' e 'max'`);
                            return { validate: false };
                        }
                        else {
                            rangeMin = rulesObj[r].min;
                            rangeMax = rulesObj[r].max;
                            dataToRangeValidate = data[key];
                        }
                    }

                    if (rangeMin > rangeMax) {
                        let tempRangeMin = rangeMax;
                        rangeMax = rangeMin;
                        rangeMin = tempRangeMin;
                    }

                    if (dataToRangeValidate < rangeMin || dataToRangeValidate > rangeMax) {
                        validated = false;
                        msg = `O valor de ${key} necessita estar entre ${rulesObj[r].min} e ${rulesObj[r].max}`;
                    }

                break;

                case "REGEX":
                    let matches = data[key].match(rulesObj[r]);

                    if (!matches) {
                        validated = false;
                        msg = `O valor do campo '${key}' não corresponde ao formato de dado exigido`;
                    }
                    break;
            }

            if (!validated) {

                if (typeof rulesObj.message === "object") {
                    if (typeof rulesObj.message[r] === "string") {
                        msg = setErrorMessage({ field: key, value: data[key], validationParamName: r, validationParamValue: rulesObj[r], message: rulesObj.message[r] });
                    }
                    else if (typeof rulesObj.message.custom === "string") {
                        msg = setErrorMessage({ field: key, value: data[key], validationParamName: r, validationParamValue: rulesObj[r], message: rulesObj.message.custom });
                    }
                }

                return { validate: false, message: msg };
            }

        };

        rulesArray.splice(rulesArray.findIndex((value) => {
            return value === key;
        }),1);

    }

    if (rulesArray.length > 0) {
        validated = rulesArray.forEach((item) => {
            if (rules[item].required) {
                msg = `É obrigatório atribuir valor ao campo '${item}'`;

                if (typeof rules[item].message === "object") {
                    if (typeof rules[item].message.required === "string") {
                        msg = setErrorMessage({ field: item, message: rules[item].message.required });
                    }
                    else if (typeof rules[item].message.custom === "string") {
                        msg = setErrorMessage({ field: item, message: rules[item].message.custom });
                    }
                }

                return false;
            }
        });
    }

    return { validate: validated, message: msg };

}


/** @description Retorna Mensagem de Erro Personalizada
 * @param { {field?: string, value?: any, validationParamName: "dataType" | "list" | "minLength" | "regex" | "maxLength" | "range" | "custom", validationParamValue?: any, message: string} } config
 * @return {string} Mensagem de Erro
 */
function setErrorMessage(config) {

    let msg = config.message;

    msg = msg.replace(/{field}/g, config.field);
    msg = msg.replace(/{value}/g, config.value);

    switch (config.validationParamName) {
        case "list":
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue.toString());
            break;

        case "range":
            msg = msg.replace(`{range[min]}`, config.validationParamValue.min);
            msg = msg.replace(`{range[max]}`, config.validationParamValue.max);
            break;

        case "len":
            msg = msg.replace(`{len[min]}`, config.validationParamValue.min);
            msg = msg.replace(`{len[max]}`, config.validationParamValue.max);
            break;

        default:
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue);
            break;
    }

    return msg;

}
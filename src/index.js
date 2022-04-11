/**
 * @file JSON Validator - Documentation Language: Brazilian Portuguese
 * @tutorial https://github.com/daiangm/Joker-Validator#readme 
*/

const validations = require('./validations');
const customValidation = require('../custom.validation');

"use strict";

const rulesFunctions = {
    list: validations.valList,
    datatype: validations.valDataType,
    len: validations.valLength,
    range: validations.valRange,
    regex: validations.valRegex,
    equals: validations.valEquals
}

/** @description Valida se os valores de campos de preenchimento obrigatório foram declarados
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
function validate(data, rules, allowedFields) {

    let result;

    try {
        result = validateData(data, rules, allowedFields)
    }
    catch (err) {
        console.error(err);
        return { validate: false, message: "Ocorreu um erro desconhecido na tentativa de validação dos dados." }
    }

    return result;

}

function validateData(data, rules, allowedFields) {

    const condition = !data || !rules || typeof rules !== "object" || typeof data !== "object";

    if (condition) {
        console.error("validateData: Um dos argumentos obrigatórios na função não foi declarado");
        return false;
    }

    let availableFieldIndex;
    let rulesObj;
    let validated = true;
    let msg = "Ok";
    let result;

    const rulesArray = Object.getOwnPropertyNames(rules);

    const allowedFieldsIsArray = allowedFields && (Array.isArray(allowedFields)) && allowedFields.length > 0;

    for (let key in data) {

        if (allowedFieldsIsArray) {
            availableFieldIndex = allowedFields.findIndex((fieldName) => {
                return fieldName === key;
            });

            if (availableFieldIndex < 0) {
                console.error(`validate: '${key}' não é um campo válido para requisição efetuada`);
                return { validate: false, message: `'${key}' não é um campo válido para requisição efetuada` };
            }
        }

        rulesObj = rules[key];

        if (!rulesObj) continue;

        if (rulesObj.custom) {
            if (typeof customValidation[rulesObj.custom] !== "object") {
                console.error(`Não há validação personalizada com o nome '${rulesObj.custom}'`);
                return { validate: false };
            }
            rulesObj = Object.assign(customValidation[rulesObj.custom], rulesObj);
        }

        for (let rulesProperty in rulesObj) {

            let currentRule = rulesFunctions[rulesProperty.toLowerCase()];

            if (currentRule) {
                result = rulesProperty.toLowerCase() === "equals" ? currentRule(rulesObj[rulesProperty], data[rulesObj[rulesProperty]], data[key], key) : currentRule(rulesObj[rulesProperty], key, data[key]);
            }

            if (!result.validate && data[key] !== null) {

                if (rulesObj.message && typeof rulesObj.message === "object") {
                    if (typeof rulesObj.message[rulesProperty] === "string" || typeof rulesObj.message.custom === "string") {
                        result.message = setErrorMessage({ field: key, value: data[key], validationParamName: r, validationParamValue: rulesObj[rulesProperty], message: rulesObj.message[rulesProperty] || rulesObj.message.custom});
                    }
                }

                return result;
            }

        };

        if(data[key] !== null){
            rulesArray.splice(rulesArray.findIndex((value) => {
                return value === key;
            }), 1);
        }

    }

    const requiredFieldsVerificationResult = validations.verifyRequiredFields(rulesArray, rules)

    if(!requiredFieldsVerificationResult.validate) return requiredFieldsVerificationResult;

    return {
        validate: validated,
        message: msg
    };

}

/** @description Retorna Mensagem de Erro Personalizada
 * @param { {field?: string, value?: any, validationParamName: "dataType" | "list" | "minLength" | "regex" | "maxLength" | "range" | "custom", validationParamValue?: any, message: string} } config
 * @return {string} Mensagem de Erro
 */
function setErrorMessage(config) {

    let msg = config.message;

    msg = msg.replace(/{field}/g, config.field).replace(/{value}/g, config.value);

    switch (config.validationParamName) {
        case "list":
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue.toString());
            break;

        case "range":
            msg = msg.replace(`{range[min]}`, config.validationParamValue.min).replace(`{range[max]}`, config.validationParamValue.max);
            break;

        case "len":
            msg = msg.replace(`{len[min]}`, config.validationParamValue.min).replace(`{len[max]}`, config.validationParamValue.max);
            break;

        default:
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue);
            break;
    }

    return msg;

}

module.exports = validate;
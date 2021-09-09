/**
 * @file JSON Schema Validator - Documentation Language: Brazilian Portuguese
 * @tutorial https://github.com/daiangm/JSON-Validator-Brazil 
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
    let result;

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
        const rulesFunctions = {
            list: valList,
            datatype: valDataType,
            len: valLength,
            range: valRange,
            regex: valRegex,
        }

        for (r in rulesObj) {

            if (rulesFunctions[r.toLowerCase()]){
                result = rulesFunctions[r.toLowerCase()](rulesObj[r], key, data[key])
            }

            if (!result.validate) {

                if (typeof rulesObj.message === "object") {
                    if (typeof rulesObj.message[r] === "string") {
                        result.message = setErrorMessage({ field: key, value: data[key], validationParamName: r, validationParamValue: rulesObj[r], message: rulesObj.message[r] });
                    }
                    else if (typeof rulesObj.message.custom === "string") {
                        result.message = setErrorMessage({ field: key, value: data[key], validationParamName: r, validationParamValue: rulesObj[r], message: rulesObj.message.custom });
                    }
                }

                return result;
            }

        };

        rulesArray.splice(rulesArray.findIndex((value) => {
            return value === key;
        }),1);

    }

    if (rulesArray.length > 0) {
        rulesArray.forEach((item) => {
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

                return validated = false;
            }
        });
    }

    return { validate: validated, message: msg };

}


const ruleIsNotArray = (value, field) => {
    
    if (Array.isArray(value) === false) {
        return {validate: false, message: `O valor de '${field}' não é um Array`}
    }
}

const ruleIsNotDate = (value, field) => {
    if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
        return {validate: false, message: `O valor de '${field}' não corresponde à uma data válida`}
    }
    else{
        return {validate: true, message: `Ok`}
    }
}

const isARule = (value, rulesConfig) => (typeof value).toUpperCase() !== rulesConfig.toUpperCase();

const RULES = {
    "ARRAY": ruleIsNotArray,
    "DATE": ruleIsNotDate,
}

const getKeys = o => Object.keys(o)

const valDataType = (rulesConfig, field, value) => 
    (getKeys(RULES).find(v => v == rulesConfig.toUpperCase()))
        ? RULES[rulesConfig.toUpperCase()](value, field)
        : (isARule(value, rulesConfig)) 
            ?   {validate: false, message: `O valor de '${field}' não corresponde ao tipo de dado exigido`}
            : {validate: true, message: `Ok`}


const validateFalse = () => {
    console.error(`A propriedade 'list' precisa ser um Array`);
    return { validate: false };
}

const validateIfIsEqual = (a, b) => a === b

const findListValueIndex = (value, rulesConfig) => 
    rulesConfig.findIndex((listValue) => validateIfIsEqual(value, listValue));

const valList = (rulesConfig, field, value) => 
    (!(Array.isArray(rulesConfig)))
        ?   validateFalse()
        :   (findListValueIndex(value, rulesConfig) < 0)
            ?   {validate: false, msg: `O valor '${value}' em '${field}' não está presente na lista de valores permitidos`}
            :   {validate: true, message: "Ok"}

const valLengthMin = (field, value, rulesConfig) => {
    console.log("valLengthMin", {field}, {value}, {rulesConfig})
        return {validate: false, message: `O valor de '${field}' não possui a quantidade mínima de caracteres exigida`}
}

const valLengthMax = (field, value, rulesConfig) => {
    console.log("valLengthMax", {field}, {value}, {rulesConfig})
        return {validate: false, message: `O valor de '${field}' não possui a quantidade mínima de caracteres exigida`}
}

const valLength = (rulesConfig, field, value) => 
    (rulesConfig.min > 0 && value.length < rulesConfig.min)
        ?   valLengthMin(field, value, rulesConfig)
        :   (rulesConfig.max > 0 && value.length > rulesConfig.max) 
            ?   valLengthMax(field, value, rulesConfig)
            :   {validate: true, message: `Ok`}
    
    
function valRange(rulesConfig, field, value){

    let rangeMin;
    let rangeMax;
    let dataToRangeValidate;

    if(typeof rulesConfig !== "object"){
        console.error(`A propriedade 'range' precisa ser necessariamente um Objeto`)
        return { validate: false }
    }
    else if (!rulesConfig.min && !rulesConfig.max) {
        console.error(`Para utilizar a propriedade 'range', as propriedades 'min' e/ou 'max' devem estar presentes no objeto com atribuição de número ou data`)
        return { validate: false }
    }

    if (typeof value === "string") {

        if (isNaN(Date.parse(value))) {
            console.error(`Valor do campo ${field} não corresponde à uma data válida para utilização da validação 'range'`);
            return { validate: false };
        }

        if(rulesConfig.min){
            if (isNaN(Date.parse(rulesConfig.min))) {
                console.error(`Valor de data inválida para utilização da propriedade 'range'`);
                return { validate: false };
            }
            else{
                rangeMin = Date.parse(rulesConfig.min);
            }
        }

        if (rulesConfig.max){
            if (isNaN(Date.parse(rulesConfig.max))) {
                console.error(`Valor de data inválida para utilização da propriedade 'range'`);
                return { validate: false };
            }
            else {
                rangeMax = Date.parse(rulesConfig.max);
            }
        }

        dataToRangeValidate = Date.parse(value);
    }
    else if(typeof value === "number"){

        if (typeof rulesConfig.min !== "number" && typeof !rulesConfig.max !== "number") {
            console.error(`Propriedade 'range' necessita pelo menos um número para definir o intervalo. Propriedades 'min' e/ou 'max'`);
            return { validate: false };
        }
        else {
            rangeMin = rulesConfig.min;
            rangeMax = rulesConfig.max;
            dataToRangeValidate = value;
        }
    }

    if (rangeMin > rangeMax) {
        let tempRangeMin = rangeMax;
        rangeMax = rangeMin;
        rangeMin = tempRangeMin;
    }

    if (dataToRangeValidate < rangeMin) {
        return{validate: false, message: `O valor de ${field} necessita ser maior ou igual a ${rulesConfig.min}`}
    }

    if(dataToRangeValidate > rangeMax){
        return {validate: false, message: `O valor de ${field} necessita ser menor ou igual a ${rulesConfig.max}`}
    }

    return {validate: true, message: `Ok`};

}

const valRegex = (rulesConfig, field, value) => 
    (!value.match(rulesConfig)) 
        ? {validate: false, message: `O valor do campo '${field}' não corresponde ao formato de dado exigido`}
        : {validate: true, message: `Ok`}

const ERRORS = {
    list: (msg, config) => msg.replace(`{${config.validationParamName}}`, config.validationParamValue.toString()),
    range: (msg, config) => {
        msg = msg.replace(`{range[min]}`, config.validationParamValue.min);
        msg = msg.replace(`{range[max]}`, config.validationParamValue.max);
        return msg;
    },
    len: (msg, config) => {
        msg = msg.replace(`{len[min]}`, config.validationParamValue.min);
        msg = msg.replace(`{len[max]}`, config.validationParamValue.max);
        return msg;
    },
    "undefined": (msg, config) => msg.replace(`{${config.validationParamName}}`, config.validationParamValue)

}

const replace = (field, value, msg, config) => 
    msg.replace(/{field}/g, config[field]).replace(/{value}/g, config[value]);

/** @description Retorna Mensagem de Erro Personalizada
 * @param { {field?: string, value?: any, validationParamName: "dataType" | "list" | "minLength" | "regex" | "maxLength" | "range" | "custom", validationParamValue?: any, message: string} } config
 * @return {string} Mensagem de Erro
 */
const setErrorMessage = (config) => 
    ERRORS[config.validationParamName](replace(field, value, config.message, config), config);
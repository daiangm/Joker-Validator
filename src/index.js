const fs = require("fs");
const path = require("path");
const customValidation = require('../custom.validation');

"use strict";

    module.exports = validateData

/** @description Valida se os valores de campos de preenchimento obrigatório foram declarados
 * @example validateData([{name: "campo1", dataType: "string", minLength: 4, maxLength: 11, custom: "NomeValidaçãoInterna"}], {"campo1": "ValorCampo1", "campo2": "ValorCampo2"...})
 * @param { {any} } data Objeto que contenha os nomes dos campos como chaves e seus respectivos valores a serem validados. Ex: { "função": "Validação" }
 * @param {Object[]} rules Array de Objetos contendo os parâmetros de validação dos dados enviados no argumento data
 * @param {string} rules[].name Nome da chave/campo do Objeto JSON em 'data' a ser validada pela função
 * @param { "string" | "number" | "object" | "array" =} rules[].dataType Tipo de dado esperado do valor do campo definido na propriedade 'name'
 * @param {[string]=} rules[].list Utilize esta propriedade para definir uma lista de valores para validação do campo definido na propriedade 'name'
 * @param {number=} rules[].minLength Quantidade mínima de caracteres/itens do valor do campo definido na propriedade 'name'
 * @param {number=} rules[].maxLength Quantidade máxima de caracteres/itens do valor do campo definido na propriedade 'name'
 * @param {{min: number, max: number}=} rules[].range Utilize as propriedades "min" e "max" para definir o intervalo (Validação ocorre apenas para valores como números e datas)
 * @param {boolean=} rules[].required Define se o campo possui preenchimento obrigatório
 * @param {string=} rules[].custom Validação de valores personalizado conforme arquivo custom.validation.js
 * @param {object} rules[].message Propriedade para personalizar a mensagem de erro para cada tipo de validação. Na string, utilize {field} para aparecer o nome do campo, {value} para aparecer o valor invalidado
 * @param {string=} rules[].message.dataType Propriedade para personalizar a mensagem de erro relacionada à validação de tipo de dados. Na string, utilize {dataType} para aparecer na mensagem o tipo de dados configurado para esta validação
 * @param {string=} rules[].message.list Propriedade para personalizar a mensagem de erro relacionada à validação de valores permitidos. Na string, utilize {list} para aparecer na mensagem a lista de valores configurada para esta validação
 * @param {string=} rules[].message.minLength Propriedade para personalizar a mensagem de erro relacionada à validação de quantidade mínima de caracteres / itens. Na string, utilize {minLength} para aparecer na mensagem o valor configurado para esta validação
 * @param {string=} rules[].message.maxLength Propriedade para personalizar a mensagem de erro relacionada à validação de quantidade máxima de caracteres / itens. Na string, utilize {maxLength} para aparecer na mensagem o valor configurado para esta validação
 * @param {string=} rules[].message.range Propriedade para personalizar a mensagem de erro relacionada à validação de intervalo permitido. Na string, utilize {range[min]} para aparecer na mensagem o valor mínimo e {range[max]} para aparecer o valor máximo configurado para esta validação
 * @param {string=} rules[].message.required
 * @param {["field1", "field2" ... string]=} allowedFields Array de Strings contendo os nomes dos Campos permitidos para a requisição
 * @return {{validate: true|false, message: string}} validate: True - Campos e Valores Validados / False - Campos e/ou Valores Inválidos
 */
function validateData(data, rules, allowedFields) {

    if (!rules || typeof data !== "object") {
        console.error("validateData: Um dos argumentos obrigatórios na função não foi declarado");
        return false;
    }

    let availableFieldIndex;
    let key;
    let rulesIndex;
    let r;
    let validated = true;
    let msg;
    let rf;

    for (key in data) {

        if (Array.isArray(allowedFields) === true) {
            if (allowedFields.length > 0) {

                availableFieldIndex = allowedFields.findIndex((fieldName) => {
                    return fieldName === key;
                });

                if (availableFieldIndex >= 0) {
                    allowedFields.splice(availableFieldIndex, 1);
                }
                else {
                    console.error(`validate: '${key}' não é um campo válido para requisição efetuada`);
                    return { validate: false, message: `'${key}' não é um campo válido para requisição efetuada` };
                }
            }
        }

        rulesIndex = rules.findIndex((item) => {
            return item.name === key;
        });

        if (rulesIndex < 0) {
            continue;
        }

        if (rules[rulesIndex].custom !== undefined && rules[rulesIndex].custom !== null && rules[rulesIndex].custom !== "") {

            if(typeof customValidation[rules[rulesIndex].customValidation] !== "object"){
                console.error(`Não há validação customizada com o nome ${rules[rulesIndex].customValidation}`);
                return {validate: false};
            }
            else{
                rules[rulesIndex] = customValidation[rules[rulesIndex].customValidation];
            }
        }


        for (r in rules[rulesIndex]) {
            switch (r.toUpperCase()) {
                case "LIST":
                    if (Array.isArray(rules[rulesIndex]["list"]) === false) {
                        console.error(`A propriedade 'list' precisa ser necessariamente um Array`);
                        return {validate: false};
                    }

                    let listValueIndex = rules[rulesIndex]["list"].findIndex((listValue) => {
                        return data[key] === listValue;
                    });

                    if (listValueIndex < 0) {
                        validated = false;
                        msg = `O valor '${data[key]}' em '${key}' não está presente na lista de valores permitidos`;
                    }
                break;

                case "DATATYPE":
                    if (rules[rulesIndex].dataType.toUpperCase() === "ARRAY") {
                        if (Array.isArray(data[key]) === false) {
                            validated = false;
                            msg = `O valor de '${key}' não é um Array`;
                        }
                    }
                    else if ((typeof data[key]).toUpperCase() !== rules[rulesIndex].dataType.toUpperCase()) {
                        validated = false;
                        msg = `O valor de '${key}' não corresponde ao tipo de dado exigido`;
                    }
                break;

                case "MINLENGTH":
                    if (rules[rulesIndex].minLength === undefined || rules[rulesIndex].minLength === null || rules[rulesIndex].minLength < 1) {
                        break;
                    }
                    if (data[key].length < rules[rulesIndex].minLength) {
                        validated = false;
                        msg = `O valor de '${key}' não possui a quantidade mínima de caracteres exigida`;
                    }
                break;

                case "MAXLENGTH":
                    if (rules[rulesIndex].maxLength === undefined || rules[rulesIndex].maxLength === null || rules[rulesIndex].maxLength < 1) {
                        break;
                    }
                    if (data[key].length > rules[rulesIndex].maxLength) {
                        validated = false;
                        msg = `O valor de '${key}' possui quantidade de caracteres/ítens maior que o máximo permitido`;
                    }
                break;

                case "RANGE":
                    if (rules[rulesIndex].range.min !== undefined && rules[rulesIndex].range.max !== undefined) {
                        if(typeof data[key] === "number"){
                            if(typeof rules[rulesIndex].range.max === "number" && typeof rules[rulesIndex].range.min === "number"){

                                if(rules[rulesIndex].range.min > rules[rulesIndex].range.max){
                                    let minRange = rules[rulesIndex].range.min;
                                    rules[rulesIndex].range.min = rules[rulesIndex].range.max;
                                    rules[rulesIndex].range.max = minRange;
                                }

                                if(data[key] < rules[rulesIndex].range.min || data[key] > rules[rulesIndex].range.max){
                                    validated = false;
                                    msg = `O valor de ${key} necessita estar entre ${rules[rulesIndex].range.min} e ${rules[rulesIndex].range.max}`;
                                }
                            }
                            else{
                                console.error(`Propriedade 'range' necessita ter dois números para definir o intervalo. Propriedades 'min' e 'max'`);
                                return { validate: false };
                            }
                        }
                        else{
                            console.error(`Para utilizar a propriedade 'range', o valor do campo deve ser um número`)
                            return { validate: false }
                        }
                    }
                break;

                case "REGEX":
                    console.log(data[key])
                    let matches = data[key].match(rules[rulesIndex][r]);
                    
                    if(!matches){
                        validated = false;
                        msg = `O valor do campo ${key} não corresponde ao formato de dado exigido`;
                    }
                break;
            }

            if(!validated){
                if (typeof rules[rulesIndex].message === "object") {
                    if (typeof rules[rulesIndex].message[r] === "string") {
                        msg = setErrorMessage({field: key, value: data[key], validationParamName: r, validationParamValue: rules[rulesIndex][r], message: rules[rulesIndex].message[r]});
                    }
                }
                return {validate: false, message: msg}
            }

        }

        rules.splice(rules.findIndex((field) => {
            return field.name === key;
        }), 1);

    }

    if (rules.length > 0) {
        for(rf of rules){
            if(rf.required === true){
                msg = `É obrigatório atribuir valor ao campo '${rf.name}'`;

                if(typeof rf.message === "object"){
                    if(typeof rf.message.required === "string"){
                        msg = setErrorMessage({field: rf.name, message: rf.message.required})
                    }
                }

                return {validate: false, message: msg}
            }
        }
    }

    if(validated){
        return { validate: true };
    }

}


/** @description Retorna Mensagem de Erro Personalizada
 * @param { {field?: string, value?: any, validationParamName: "dataType" | "list" | "minLength" | "maxLength" | "range" | "custom", validationParamValue?: any, message: string} } config
 * @return {string} Mensagem de Erro
 */
function setErrorMessage(config){

    let msg = config.message;

    msg = msg.replace("{field}", config.field);
    msg = msg.replace("{value}", config.value);

    switch(config.validationParamName){
        case "list":
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue.toString());
        break; 

        case "range":
            msg = msg.replace(`{range[min]}`, config.validationParamValue.min);
            msg = msg.replace(`{range[max]}`, config.validationParamValue.max);
        break;

        default:
            msg = msg.replace(`{${config.validationParamName}}`, config.validationParamValue);
        break;
    }

    return msg;

}
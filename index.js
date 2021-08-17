"use strict";

    module.exports = validateData

/** @description Valida se os valores de campos de preenchimento obrigatório foram declarados
 * @example validateData([{name: "campo1", dataType: "string", minLength: 4, maxLength: 11, customValidation: "NomeValidaçãoInterna"}], {"campo1": "ValorCampo1", "campo2": "ValorCampo2"...})
 * @param { {any} } data Objeto que contenha os nomes dos campos como chaves e seus respectivos valores a serem validados. Ex: { "função": "Validação" }
 * @param {Object[]} rules Array de Objetos contendo os parâmetros de validação dos dados enviados no argumento data
 * @param {string} rules[].name Nome da chave/campo do Objeto JSON em 'data' a ser validada pela função
 * @param { "string" | "number" | "object" | "array" =} rules[].dataType Tipo de dado esperado do valor do campo definido na propriedade 'name'
 * @param {[string]=} rules[].list Utilize esta propriedade para definir uma lista de valores para validação do campo definido na propriedade 'name'
 * @param {number=} rules[].minLength Quantidade mínima de caracteres/itens do valor do campo definido na propriedade 'name'
 * @param {number=} rules[].maxLength Quantidade máxima de caracteres/itens do valor do campo definido na propriedade 'name'
 * @param {{min: number, max: number}=} rules[].range Utilize as propriedades "min" e "max" para definir o intervalo (Validação ocorre apenas para valores como números e datas)
 * @param {boolean=} rules[].required Define se o campo possui preenchimento obrigatório
 * @param {boolean=} rules[].customValidation Validação de valores personalizado conforme arquivo custom.json
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

    if (rules === undefined || data === undefined || typeof data !== "object") {
        console.error("validate: Um dos argumentos obrigatórios na função não foi declarado");
        return false;
    }

    let availableFieldIndex;
    let key;
    let fvsIndex;
    let fvs;
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

        fvsIndex = rules.findIndex((item) => {
            return item.name === key;
        });

        if (fvsIndex < 0) {
            continue;
        }

        if (rules[fvsIndex].customValidation !== undefined && rules[fvsIndex].customValidation !== null && rules[fvsIndex].customValidation !== "") {
            //CHAMAR FUNÇÃO DE VALIDAÇÃO CUSTOMIZADA AQUI
            continue;
        }



        for (fvs in rules[fvsIndex]) {
            switch (fvs.toUpperCase()) {
                case "LIST":
                    if (Array.isArray(rules[fvsIndex]["list"]) === false) {
                        console.error(`A propriedade 'list' precisa ser necessariamente um Array`);
                        return {validate: false};
                    }

                    let listValueIndex = rules[fvsIndex]["list"].findIndex((listValue) => {
                        return data[key] === listValue;
                    });

                    if (listValueIndex < 0) {
                        validated = false;
                        msg = `O valor '${data[key]}' em '${key}' não está presente na lista de valores permitidos`;
                    }
                break;

                case "DATATYPE":
                    if (rules[fvsIndex].dataType.toUpperCase() === "ARRAY") {
                        if (Array.isArray(data[key]) === false) {
                            validated = false;
                            msg = `O valor de '${key}' não é um Array`;
                        }
                    }
                    else if ((typeof data[key]).toUpperCase() !== rules[fvsIndex].dataType.toUpperCase()) {
                        validated = false;
                        msg = `O valor de '${key}' não corresponde ao tipo de dado exigido`;
                    }
                break;

                case "MINLENGTH":
                    if (rules[fvsIndex].minLength === undefined || rules[fvsIndex].minLength === null || rules[fvsIndex].minLength < 1) {
                        break;
                    }
                    if (data[key].length < rules[fvsIndex].minLength) {
                        validated = false;
                        msg = `O valor de '${key}' não possui a quantidade mínima de caracteres exigida`;
                    }
                break;

                case "MAXLENGTH":
                    if (rules[fvsIndex].maxLength === undefined || rules[fvsIndex].maxLength === null || rules[fvsIndex].maxLength < 1) {
                        break;
                    }
                    if (data[key].length > rules[fvsIndex].maxLength) {
                        validated = false;
                        msg = `O valor de '${key}' possui quantidade de caracteres/ítens maior que o máximo permitido`;
                    }
                break;

                case "RANGE":
                    if (rules[fvsIndex].range.min !== undefined && rules[fvsIndex].range.max !== undefined) {
                        if(typeof data[key] === "number"){
                            if(typeof rules[fvsIndex].range.max === "number" && typeof rules[fvsIndex].range.min === "number"){

                                if(rules[fvsIndex].range.min > rules[fvsIndex].range.max){
                                    let minRange = rules[fvsIndex].range.min;
                                    rules[fvsIndex].range.min = rules[fvsIndex].range.max;
                                    rules[fvsIndex].range.max = minRange;
                                }

                                if(data[key] < rules[fvsIndex].range.min || data[key] > rules[fvsIndex].range.max){
                                    validated = false;
                                    msg = `O valor de ${key} necessita estar entre ${rules[fvsIndex].range.min} e ${rules[fvsIndex].range.max}`;
                                }
                            }
                            else{
                                console.error(`Propriedade 'range' necessita ter dois números para definir o intervalo`);
                                return { validate: false };
                            }
                        }
                        else{
                            console.error(`Para utilizar a propriedade 'range', o valor do campo deve ser um número`)
                            return { validate: false }
                        }
                    }
                break;
            }

            if(!validated){
                if (typeof rules[fvsIndex].message === "object") {
                    if (typeof rules[fvsIndex].message[fvs] === "string") {
                        msg = setErrorMessage({field: key, value: data[key], validationParamName: fvs, validationParamValue: rules[fvsIndex][fvs], message: rules[fvsIndex].message[fvs]});
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
 * @param { {field?: string, value?: any, validationParamName: "dataType" | "list" | "minLength" | "maxLength" | "range", validationParamValue?: any, message: string} } config
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

/** @description Retorna Mensagem de Erro Personalizada
 * @param { {field: string, value: any, customValidation: string, message: string} } config
 * @return {boolean} Mensagem de Erro
 */
function customizedValidate(config){

    const matches = config.value.match(/^\S+@(\S+\.\S+)$/i);
    console.log(matches)

}

customizedValidate({value: "daiangm"});
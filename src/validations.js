module.exports = {valDataType, valLength, valList, valRange, valRegex}

function valDataType(rulesConfig, field, value){

    switch(rulesConfig.toLowerCase()){

        case "array":
            if (Array.isArray(value) === false) {
                return {validate: false, message: `O valor de '${field}' não é um Array`}
            }
        break;

        case "date":
            if (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value)))) {
                return {validate: false, message: `O valor de '${field}' não corresponde à uma data válida`}
            }
        break;

        default:
            if ((typeof value).toUpperCase() !== rulesConfig.toUpperCase()) {
                return {validate: false, message: `O valor de '${field}' não corresponde ao tipo de dado exigido`}
            }
        break;
    }

    return {validate: true, message: `Ok`}

}

function valList(rulesConfig, field, value){

    if (!(Array.isArray(rulesConfig))) {
        console.error(`A propriedade 'list' precisa ser um Array`);
        return { validate: false };
    }

    let listValueIndex = rulesConfig.findIndex((listValue) => {
        return value === listValue;
    });

    if (listValueIndex < 0) {
        return {validate: false, msg: `O valor '${value}' em '${field}' não está presente na lista de valores permitidos`}
    }

    return {validate: true, message: "Ok"}

}

function valLength(rulesConfig, field, value){

    if (rulesConfig.min > 0) {
        if (value.length < rulesConfig.min) {
            return {validate: false, message: `O valor de '${field}' não possui a quantidade mínima de caracteres exigida`}
        }
    }

    if (rulesConfig.max > 0) {
        if (value.length > rulesConfig.max) {
            return {validate: false, message: `O valor de '${field}' possui quantidade de caracteres/ítens maior que o máximo permitido`}
        }
    }

    return {validate: true, message: `Ok`}

}

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
            rangeMin = Date.parse(rulesConfig.min);
        }

        if (rulesConfig.max){
            if (isNaN(Date.parse(rulesConfig.max))) {
                console.error(`Valor de data inválida para utilização da propriedade 'range'`);
                return { validate: false };
            }
            rangeMax = Date.parse(rulesConfig.max);
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

function valRegex(rulesConfig, field, value){

    let matches = value.match(rulesConfig);

    if (!matches) {
        return {validate: false, message: `O valor do campo '${field}' não corresponde ao formato de dado exigido`}
    }

    return {validate: true, message: `Ok`}

}
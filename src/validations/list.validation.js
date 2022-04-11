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

module.exports = {valList}
const validate = require('./index');

//const validate = require('lib/validate/src/index');

const dataExample = {
    username: "daiangm",
    email: "daiangm@gmail.com",
    password: "password",
    phone: "(62)99999-9999",
    cpf: "000.000.000-00",
    birthdate: "12/12/1990",
    uf: "GO",
    //id: 666
}

const rules = {
    username: {
        dataType: "string",
        len: { min: 4 },
        required: true
    },
    email: {
        custom: "email",
        required: true,
        message: { custom: "'{value}' não é um endereço de e-mail válido" }
    },
    password: {
        dataType: "string",
        len: { min: 3, max: 16 },
        required: true,
        message: {required: "É obrigatório o preenchimento do campo '{field}'"}
    },
    phone: {
        custom: "phone",
        required: true
    },
    cpf: {
        regex: /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/i
    },
    birthdate: {
        dataType: "date",
        range: { min: "1900-01-01", max: "2003-01-01"}
    },
    uf: {
        list: ["GO", "MT", "MS"],
        message: { list: "O valor do campo '{field}' precisa ser preenchido com um dos valores da lista: {list}" }
    }
}

const allowedFields = ["username", "email", "password", "phone", "cpf", "birthdate", "uf"]

const result = validate(dataExample, rules, allowedFields);

console.log(result);

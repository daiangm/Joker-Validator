const validate = require('./index');

//const validate = require('lib/validate/src/index');

const dataExample = {
    username: "daiangm",
    email: "daiangm@github.com",
    password: "Pa$$w0rd",
    check_pass: "Pa$$w0rd",
    phone: "(62)99999-9999",
    cpf: "000.000.000-00",
    birthdate: "12/12/1990",
    uf: "GO",
}

const rules = {
    username: {
        dataType: "string",
        len: { min: 3, max: 16 },
        required: true,
        message: {len: "O valor de {field} deve ter entre {len[min]} e {len[max]} caracteres"}
    },
    email: {
        custom: "email",
        required: true,
        message: { custom: "'{value}' não é um endereço de {field} válido" }
    },
    password: {
        dataType: "string",
        custom: "Pa$$w0rd",
        len: { min: 8, max: 16 },
        required: true,
        message: {required: "É obrigatório o preenchimento do campo '{field}'"}
    },
    check_pass:{
        equals: "password",
        required: true
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

const allowedFields = ["username", "email", "password", "check_pass", "phone", "cpf", "birthdate", "uf"]

const result = validate(dataExample, rules, allowedFields);

console.log(result);

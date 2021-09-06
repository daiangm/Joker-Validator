# json-validator-BR
Validador de dados JSON para NodeJS

<h2> O <b>json-validator</b> analisa os dados indicados e os valida através de regras personalizadas como parâmetros na função.</h2>

Este método funciona através de 3 argumentos principais <i><b>data</b></i> (obrigatório), <i><b>rules</b></i> (obrigatório) e <i><b>allowedFields</b></i> (opcional).

<i><b>data</b></i>: JSON baseado em chaves e valores como ``` { library: "json-validator" } ```. </br>
Parâmetro <b>obrigatório</b> para chamar a função.</br>
Este pode ser os dados enviados através de uma requisição HTTP (REST). Verificar <i>const</i> ``dataExample`` no exemplo abaixo.

<i><b>rules</b></i>: Objeto Javascript que contêm as regras para validação dos valores enviados em <i>data</i>. </br>
Parâmetro <b>obrigatório</b> para chamar a função.</br>
Verificar <i>const</i> ``rules`` no exemplo abaixo.

Estrutura e suas propriedades</br>
```dataType```: Esta propriedade serve para comparar se o tipo de dado enviado em <i>data</i> (conforme a chave indicada). </br>
Valores aceitáveis: <i>string</i>, <i>number</i>, <i>boolean</i>, <i>date</i>, <i>object</i> e <i>array</i>

<i><b>allowedFields</b></i>: Array que contêm os nomes dos campos aceitáveis em <i>data</i>. Este parâmetro serve para limitar quais campos serão aceitos e não permite que tenha outros campos em <i>data</i>, ou seja, caso tenha algum campo com nome diferente dos que estão listados em <i>allowedFields</i>, a função retornará ``{validate: false}``</br>
Este <b>não</b> é um parâmetro obrigatório para chamar a função.</br>
Verificar <i>const</i> ``allowedFields`` no exemplo abaixo.

<h2>Exemplo:</h2>

```javascript
const validate = require('lib/validate/src/index');


const dataExample = {
    username: "daiangm",
    email: "daiangm@gmail.com",
    password: "password",
    phone: "(62)99999-9999",
    cpf: "000.000.000-00",
    birthdate: "1990-12-12",
    uf: "GO"
}

const rules = {
    username: {
        dataType: "string",
        len: { min: 3, max: 16 },
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

if(!result.validate){
    return false;
}

```

# json-validator-BR
Validador de dados JSON para NodeJS

## O <b>json-validator</b> analisa os dados indicados e os valida através de regras personalizadas enviadas como parâmetros na função.

Este método funciona através de 3 argumentos: <i><b>data</b></i>, <i><b>rules</b></i> e <i><b>allowedFields</b></i>.

<!--ts-->
   * [data](#data)
   * [rules](#rules)
      * [dataType](#dataType)
      * [length](#length)
      * [range](#range)
      * [list](#list)
      * [required](#required)
      * [regex](#regex)
      * [custom](#custom)
      * [message](#message)
   * [allowedFields](#allowedFields)
   * [Exemplo](#exemplo)
<!--te-->

### data 
<a href="#data"><img id="data" src="https://img.shields.io/static/v1?label=Object&message=Obrigatorio&color=darkred&style=flat&labelColor=informational" /></a> </br>
JSON baseado em chaves e valores como ``` { "library": "json-validator" } ```. </br>
Este pode ser os dados enviados através de uma requisição HTTP (REST). </br>
Verificar <a href="#exemplo"><i>const dataExample</i></a> no exemplo abaixo.

### rules
<a href="#rules"><img id="rules" src="https://img.shields.io/static/v1?label=Object&message=Obrigatorio&color=darkred&style=flat&labelColor=informational" /></a> </br>
Objeto Javascript que contêm as regras para validação dos valores enviados em <i>data</i>. </br>

<u>Propriedades aceitáveis</u>:

<a href="#length"><img id="dataType" src="https://img.shields.io/static/v1?label=dataType&message=String&color=9cf&style=social" /></a> </br>
Esta propriedade serve para comparar se o tipo de dado enviado em <i><b>data</b></i> (conforme a chave indicada) corresponde ao valor setado aqui. </br>
Valores aceitáveis: <i>string</i>, <i>number</i>, <i>boolean</i>, <i>date</i> (UTC), <i>object</i> e <i>array</i> </br>
Ex: ```library: {dataType: "string"}``` </br>
</br>

<img id="length" src="https://img.shields.io/static/v1?label=length&message=Object&color=9cf&style=social" /> </br>
Define a quantidade mínima e máxima de caracteres de uma <i>String</i> ou itens de um <i>Array</i>. Você deve utilizar as propriedades <i><b>min</b></i> e <i><b>max</b></i>. </br>
Ex: ``library: {length: { min: 4, max: 14 }}`` </br>
</br>

<a href="#range"><img id="range" src="https://img.shields.io/static/v1?label=range&message=Object&color=9cf&style=social" /></a> </br>
Define um intervalo númerico ou de data (date) aceitável para o valor enviado em <i><b>data</b></i> na chave indicada. Você deve utilizar as propriedades <i><b>min</b></i> e <i><b>max</b></i>. </br>
Ex: ``date: {range: { min: "1921-01-01", max: "1999-01-01"}}``</br>
###### --> Neste exemplo, queremos determinar que <i>date</i> só é aceitável com um intervalo entre 18 e 100 anos em relação à 01/01/2021

<a href="#list"><img id="list" src="https://img.shields.io/static/v1?label=list&message=Array&color=9cf&style=social" /></a> </br>
Array de _Strings_ e/ou Números aceitáveis para o valor de uma determinada chave em <i><b>data</b></i>. </br>
Ex: ``uf: {list: ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"]}``</br>
</br>

<a href="#required"><img id="required" src="https://img.shields.io/static/v1?label=required&message=Boolean&color=9cf&style=social" /></a> </br>
Determina se o valor do campo em ***data*** é de preenchimento obrigatório.</br>
Ex: ``library: {required: true}``</br>
</br>

Verificar ***const rules*** no exemplo abaixo.

### allowedFields
![Badge](https://img.shields.io/static/v1?label=Array&message=Opcional&color=424242&style=flat&labelColor=informational) </br>
Array que contêm os nomes dos campos aceitáveis em <i>data</i>. Este parâmetro serve para limitar quais campos serão aceitos e não permite que tenha outros campos em <i>data</i>, ou seja, caso tenha algum campo com nome diferente dos que estão listados em <i>allowedFields</i>, a função retornará ``{validate: false}``</br>
Verificar <i>const</i> ``allowedFields`` no exemplo abaixo.

## Exemplo

```javascript
const validate = require('lib/validate/src/index');


const dataExample = {
    "username": "daiangm",
    "email": "daiangm@gmail.com",
    "password": "password",
    "phone": "(62)99999-9999",
    "cpf": "000.000.000-00",
    "birthdate": "1990-12-12",
    "uf": "GO"
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

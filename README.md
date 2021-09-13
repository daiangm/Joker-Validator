<a href="#"><img src="https://i.imgur.com/CvV9wA4.jpeg" style="width: 300px; height: auto" title="JSON Validator" alt="Logo de JSON Validator Brazil"/></a>

### Validador de dados JSON para NodeJS

## O <b>json-validator</b> analisa os dados enviados conforme regras personalizadas indicadas como parâmetros na função, retorna o resultado da validação e, caso os dados estejam inválidos, retorna também uma mensagem de erro padrão ou personalizada.

### Parâmetros da Função:

Este método funciona através de 3 argumentos: ***data***, ***rules*** e ***allowedFields***.

### Índice:
<!--ts-->
   1. [data](#data)
   2. [rules](#rules)
      * [dataType](#dataType)
      * [len](#length)
      * [range](#range)
      * [list](#list)
      * [required](#required)
      * [regex](#regex)
      * [custom](#custom)
      * [message](#message)
   3. [allowedFields](#allowedFields)
<!--te-->

[Exemplo](#exemplo)

### data 
<a href="#data"><img id="data" src="https://img.shields.io/static/v1?label=Object&message=Obrigat%C3%B3rio&color=darkred&style=flat&labelColor=6513BF" /></a> </br>
JSON baseado em chaves e valores como ``` { "library": "json-validator" } ```. </br>
Este pode ser os dados enviados através de uma requisição HTTP (REST). </br>
Verificar <a href="#exemplo"><i>const dataExample</i></a> no exemplo abaixo.

### rules
<a href="#rules"><img id="rules" src="https://img.shields.io/static/v1?label=Object&message=Obrigat%C3%B3rio&color=darkred&style=flat&labelColor=6513BF" /></a> </br>
Objeto Javascript que contêm as regras para validação dos valores enviados em <i>data</i>. </br>

<u>Propriedades aceitáveis</u>:

<a href="#dataType"><img id="dataType" src="https://img.shields.io/static/v1?label=dataType&message=String&color=9cf&style=social" /></a> </br>
Esta propriedade serve para comparar se o tipo de dado enviado em <i><b>data</b></i> (conforme a chave indicada) corresponde ao valor setado aqui. </br>
Valores aceitáveis: <i>string</i>, <i>number</i>, <i>boolean</i>, <i>date</i> (UTC), <i>object</i> e <i>array</i> </br>
Ex: ```library: {dataType: "string"}``` </br>
</br>

<a href="#length"><img id="length" src="https://img.shields.io/static/v1?label=len&message=Object&color=9cf&style=social" /></a> </br>
Define a quantidade mínima e máxima de caracteres de uma <i>String</i> ou itens de um <i>Array</i>. Você deve utilizar as propriedades <i><b>min</b></i> e/ou <i><b>max</b></i>. </br>
Ex: ``library: {len: { min: 4, max: 14 }}`` </br>
</br>

<a href="#range"><img id="range" src="https://img.shields.io/static/v1?label=range&message=Object&color=9cf&style=social" /></a> </br>
Define um intervalo númerico ou de data (_date_) aceitável para o valor enviado em <i><b>data</b></i> na chave indicada. Você deve utilizar as propriedades <i><b>min</b></i> e/ou <i><b>max</b></i>. </br>
Ex: ``date: {range: { min: "1921-01-01", max: "1999-01-01"}}``</br>
###### --> Neste exemplo, queremos determinar que o valor de <i>date</i> em ***data*** só é aceitável em um intervalo entre 18 e 100 anos em relação à 01/01/2021

<a href="#list"><img id="list" src="https://img.shields.io/static/v1?label=list&message=Array&color=9cf&style=social" /></a> </br>
Array de _Strings_ e/ou Números aceitáveis para o valor de uma determinada chave em <i><b>data</b></i>. </br>
Ex: ``uf: {list: ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"]}``</br>
</br>

<a href="#required"><img id="required" src="https://img.shields.io/static/v1?label=required&message=Boolean&color=9cf&style=social" /></a> </br>
Determina se o valor do campo em ***data*** é de preenchimento obrigatório.</br>
Ex: ``library: {required: true}``</br>
</br>

<a href="#regex"><img id="regex" src="https://img.shields.io/static/v1?label=regex&message=RegExp&color=9cf&style=social" /></a> </br>
Compara se o valor do campo em ***data*** se enquadra na <a href="https://regexr.com/" target="_blank">Expressão Regular em Javascript</a>. definida na propriedade.</br>
Ex: ``cep: {regex: /^[0-9]{8}|([0-9]{5}|[0-9]{2}.[0-9]{3})-[0-9]{3}$/i}``</br>
</br>

<a href="#custom"><img id="custom" src="https://img.shields.io/static/v1?label=custom&message=String&color=9cf&style=social" /></a> </br>
Compara o valor do campo em ***data*** conforme configuração de validação no Objeto ***customValidation*** em <a href="https://github.com/daiangm/json-validator-BR/blob/main/custom.validation.js" target="_blank"><i>custom.validation.js</i></a>. </br>
Ex: ``email: {custom: "email"}``</br>
##### Em ***customValidation***, você pode adicionar um conjunto de regras de validação e atribuir o nome que desejar.
##### Por padrão, ***customValidation*** possui validação de número de celular (formato brasileiro), e-mail, CEP e URL.
</br>

<a href="#message"><img id="message" src="https://img.shields.io/static/v1?label=message&message=Object&color=9cf&style=social" /></a> </br>
Personaliza a mensagem de erro no retorno da função conforme a regra definida. </br>
Na _String_ da mensagem, utilize {value} para imprimir o valor do campo em ***data***, {field} para o nome do campo/chave em ***data*** e {<i>NomeDaRegra</i>} para o valor da regra (Ex: {list}) </br>
Para valores das regras utilize: {dataType}, {minLength}, {maxLength}, {minRange}, {maxRange}, {list}, {required}, {regex} e {custom}. </br>
Ex: ``library: {dataType: "number", message: {dataType: "'{value}' do campo '{field}' não corresponde ao tipo de dado '{dataType}'"} }``</br>
Retorno do exemplo acima: </br>
``{validate: false, message: "'json-validator' do campo 'library' não corresponde ao tipo de dado 'number'"}``
</br>

Verificar <a href="#exemplo"><i>const rules</i></a> no exemplo abaixo.

### allowedFields
<a href="#allowedFields"><img id="allowedFields" src="https://img.shields.io/static/v1?label=Array&message=Opcional&color=424242&style=flat&labelColor=6513BF" /></a> </br>
Array que contêm os nomes dos campos aceitáveis em <i>data</i>. Este parâmetro serve para limitar quais campos serão aceitos e não permite que tenha outros campos em <i>data</i>, ou seja, caso tenha algum campo com nome diferente dos que estão listados em <i>allowedFields</i>, a função retornará ``{validate: false}``</br>
Verificar <a href="#exemplo"><i>const allowedFields</i></a> no exemplo abaixo.

## Exemplo

```javascript
const validate = require('lib/validate/src/index'); //--> No seu projeto, você deve clonar o json-validator para a pasta lib/validate


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

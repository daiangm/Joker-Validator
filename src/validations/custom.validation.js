
/* 
    Propriedades aceitáveis:
    {   
        dataType: string,
        list: [...string],
        minLength: number,
        maxLength: number,
        range: {min: number, max: number},
        regex: RegExp,
        required: boolean,
        message:{custom: string}
    }
*/

const customValidation = {
    email:{
        regex: /^\S+@(\S+\.\S+|localhost)$/i
    },
    url:{
        regex: /^([a-z]+\:\/\/|\/\/)(\S+\.\S+|localhost)[\/\?\S]*$/i
    },
    phone: {
        regex: /^\([1-9]{1}[0-9]{1}\)[1-9]{2}[0-9]{3}\-[0-9]{4}$/i
/*
    Formato '+DDI(DDD)#####-####':
    /^(\+|)(([1-9]{1})([0-9]{2}|[0-9]{1})|)(\([1-9]{1}([0-9]{1}|[0-9]{2})\)|[1-9]{1}([0-9]{1}|[0-9]{2}))[1-9]{2}[0-9]{3}(\-|)[0-9]{4}$/g 
*/
    },
    cep: {
        regex: /^[0-9]{8}|([0-9]{5}|[0-9]{2}.[0-9]{3})-[0-9]{3}$/i
    },
    Pa$$w0rd:{
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/i
        /* Pelo menos uma letra maiúscula, número e caractere especial */
    },
    Passw0rd:{
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{3,}$/i
        /* Pelo menos uma letra maiúscula e número */
    }
};

module.exports = customValidation;
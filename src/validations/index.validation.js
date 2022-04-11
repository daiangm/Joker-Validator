const {valDataType} = require("./dataType.validation")
const {valList} = require("./list.validation")
const {valLength} = require("./length.validation")
const {valRange} = require("./range.validation")
const {valRegex} = require("./regexp.validation")
const {valEquals} = require("./equals.validation")
const {verifyRequiredFields} = require("./requiredFields.validation")

module.exports = {
    valDataType,
    valList,
    valLength,
    valRange,
    valRegex,
    valEquals,
    verifyRequiredFields
}
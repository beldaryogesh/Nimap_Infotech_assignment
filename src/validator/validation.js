const isValidRequestBody = function (reqbody) {
  if (!Object.keys(reqbody).length) {
    return false;
  }
  return true;
};

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

let nameRegex = /^[.a-zA-Z\s]+$/;
let emailRegex =/^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
let passRegex =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
let numRegex = /^[0-9]*$/;
let priceReg = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
let numsRegex = /^(0|1)$/;
let sizeRegex = /^(S|XS|M|X|L|XXL|XL)$/

module.exports = {
  isValid,
  isValidRequestBody,
  nameRegex,
  emailRegex,
  phoneRegex,
  passRegex,
  numRegex,
  priceReg,
  numsRegex,
  sizeRegex
};

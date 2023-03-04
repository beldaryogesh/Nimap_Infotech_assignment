const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const pinValidator = require("pincode-validator");
const {
  isValidRequestBody,
  isValid,
  nameRegex,
  emailRegex,
  phoneRegex,
  passRegex,
} = require("../validator/validation");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let { fname, lname, email, phone, password, address } = data;
    if (!isValidRequestBody(data))
      return res
        .status(400)
        .send({ status: false, message: "Provide the data in request body." });

    //--------------------------fname validation----------------------------//

    if (!isValid(fname))
      // --> name should be provided in the body
      return res
        .status(400)
        .send({ status: false, message: "Please enter the fname." });
    if (!nameRegex.test(fname))
      // --> name should be provided in right format
      return res.status(400).send({
        status: false,
        message: "fname should contain alphabets only.",
      });

    //--------------------------fname validation----------------------------//

    if (!isValid(lname))
      // --> lname should be provided in the body
      return res
        .status(400)
        .send({ status: false, message: "Please enter the lname." });
    if (!nameRegex.test(lname))
      // --> lname should be provided in right format
      return res.status(400).send({
        status: false,
        message: "lname should contain alphabets only.",
      });
    //--------------------------email validation----------------------------//

    if (!isValid(email))
      // --> email should be provided in the body
      return res
        .status(400)
        .send({ status: false, message: "Please enter the email." });
    if (!emailRegex.test(email))
      // --> email should be provided in right format
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid emailId." });
    let getEmail = await userModel.findOne({ email: email }); // --> to check if provided email is already present in the database
    if (getEmail) {
      // --> if that email is already provided in the database
      return res.status(400).send({
        status: false,
        message: "Email is already in use, please enter a new one.",
      });
    }
    //--------------------------phone validation----------------------------//

    if (!isValid(phone))
      // --> phone number should be provided in the body
      return res
        .status(400)
        .send({ status: false, message: "Please enter the phone number." });
    if (!phoneRegex.test(phone))
      // --> phone number should be provided in right format
      return res.status(400).send({
        status: false,
        message: "Enter the phone number in valid Indian format.",
      });
    let getPhone = await userModel.findOne({ phone: phone }); // --> to check if provided phone number is already present in the database
    if (getPhone) {
      // --> if that phone number is already provided in the database
      return res.status(400).send({
        status: false,
        message: "Phone number is already in use, please enter a new one.",
      });
    }

    //--------------------------password validation----------------------------//

    if (!isValid(password))
      // --> password should be provided in the body
      return res
        .status(400)
        .send({ status: false, message: "Please enter the password. ⚠️" });
    if (!passRegex.test(password))
      // --> password should be provided in right format
      return res.status(400).send({
        status: false,
        message:
          "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character.",
      });
    if (address) {
      if (
        !isValid(data.address.street) ||
        !isValid(data.address.city) ||       // --> // --> address should be provided in the body
        !isValid(data.address.pincode)
      )
        return res.status(400).send({
          status: false,
          message: "Enter the street, city and pincode in the address.",
        });
      let pinValidated = pinValidator.validate(data.address.pincode);
      if (!pinValidated)
        return res            
          .status(400)
          .send({ status: false, message: "Please enter a valid pincode." });
    }
    const createUser = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: `User registered successfully`,
      data: createUser,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email && !password)
      return res.status(400).send({
        status: false,
        msg: "Provide the email and password to login.",
      }); // if either email, password or both not present in the request body.
    if (!email)
      return res.status(400).send({
        status: false,
        msg: "Provide the email to login.",
      });
    if (!password)
      return res.status(400).send({
        status: false,
        msg: "Provide the passeword to login.",
      });
    if (!emailRegex.test(email))
      // --> email should be provided in right format
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid emailId. ⚠️" });

    let user = await userModel.findOne({ email: email, password: password }); // to find that particular user document.
    if (!user)
      return res
        .status(401)
        .send({ status: false, msg: "Email or password is incorrect." }); // if the user document isn't found in the database.

    let token = jwt.sign(
      // --> to generate the jwt token
      {
        userId: user._id.toString(),
        organisation: "Nimap_Infotech", // --> payload
      },
      "Nimap_Infotech" // --> secret key
    );

    res.setHeader("x-api-key", token);
    return res
      .status(200)
      .send({ status: true, message: "Success", data: token }); // token is shown in the response body.
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};

module.exports = { registerUser, loginUser };
const productModel = require("../models/productModel");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const {
  isValid,
  isValidRequestBody,
  nameRegex,
  numRegex,
  categoryIdRegex,
} = require("../validator/validation");

const createProduct = async function (req, res) {
  try {
    let data = req.body;
    //------------------------------------- Distructuring------------------------------//
    const {
      ProductName,
      CategoryName,
      CategoryId,
      description,
      price,
      currencyId,
      currencyFormat,
      availableSizes,
      installments,
    } = data;
    //----------------------------------- All validation------------------------------//
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide the Details" });
    }
    //    --------------------------ProductName validation----------------------------------//
    if (!isValid(ProductName)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the ProductName" });
    }
    if (!nameRegex.test(ProductName))
      return res.status(400).send({
        status: false,
        message: "ProductName should contain alphabets only.",
      });
    const checkProductName = await productModel.findOne({
      ProductName: ProductName,
    });
    if (checkProductName)
      return res
        .status(400)
        .send({ status: false, msg: "ProductName is already present" });
    // -------------------------------categoryName validation---------------------------//
    if (!isValid(CategoryName)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the CategoryName" });
    }

    // --------------------------categoryId validation----------------------------------//
    if (!isValid(CategoryId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the categoryId" });
    }
    if (!categoryIdRegex.test(CategoryId))
      return res
        .status(400)
        .send({ status: false, message: "please provide valid categoryId." });
    const checkcategoryId = await productModel.findOne({
      CategoryId: CategoryId,
    });
    if (checkcategoryId)
      return res
        .status(400)
        .send({ status: false, msg: "please provide unique categoryId" });

    // -------------------------------Description validation--------------------------//
    if (!isValid(description)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the description" });
    }
    // -------------------------------Price validation---------------------------------//
    if (!isValid(price)) {
      return res.status(400).send({ status: false, msg: "please enter price" });
    }
    if (!Number(price)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide numerical price" });
    }
    // -------------------------------currencyId validation----------------------------------//
    if (!isValid(currencyId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide currencyId" });
    }
    if (currencyId != "INR") {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid currencyId" });
    }
    // -------------------------------currencyFormat validation-----------------------------//
    if (!currencyFormat) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide currencyFormet" });
    }
    if (currencyFormat !== "₹") {
      return res
        .status(400)
        .send({ status: false, msg: 'currencyFormat should be "₹" ' });
    }
    // -------------------------------style validation---------------------------------------//
    let bodyFromReq = JSON.parse(JSON.stringify(data));
    if (bodyFromReq.hasOwnProperty("style"))
      if (!isValid(style))
        return res
          .status(400)
          .send({ status: false, Message: "Please provide style field" });
    // -------------------------------availableSizes validation-----------------------------//
    if (!availableSizes) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide availableSizes" });
    }
    if (availableSizes.length < 1) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter size of product" });
    }
    sizeArr = availableSizes.replace(/\s+/g, "").split(",");

    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
    let flag;
    for (let i = 0; i < sizeArr.length; i++) {
      flag = arr.includes(sizeArr[i]);
    }
    if (!flag) {
      return res.status(400).send({
        status: false,
        data: "Enter a valid size S or XS or M or X or L or XXL or XL ",
      });
    }
    data["availableSizes"] = sizeArr;
    // -------------------------------installments validation-----------------------------//
    if (installments || installments === "") {
      if (!isValid(installments))
        return res
          .status(400)
          .send({ status: false, Message: "Please provide installments" });
      if (!numRegex.test(installments)) {
        return res.status(400).send({
          status: false,
          msg: "please provide installement only numercial value",
        });
      }
    }

    const product = await productModel.create(data);
    return res.status(201).send({
      status: true,
      message: "product create successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getProduct = async function (req, res) {
  try {
    let data = req.body;
    const { ProductId, ProductName, CategoryName, CategoryId } = data;
    //-------------------------------productId------------------------------------
    if (ProductId !== undefined) {
      if (!isValid(ProductId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide productId" });
      }
      if (!isValidObjectId(ProductId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide valid productId" });
      }
      let CheckproductId = await productModel.findById({ _id: ProductId });
      if (!CheckproductId) {
        return res
          .status(404)
          .send({ status: false, msg: "productId is not exist in database" });
      }
      let productData = await productModel.find({ productId: ProductId });
      if (productData.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such product are found for this productId",
        });
      } else {
        return res.status(200).send({ data: productData });
      }
    }
    //-------------------------------ProductName------------------------------------
    else if (ProductName !== undefined) {
      if (!isValid(ProductName)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide ProductName" });
      }
      if (!nameRegex.test(ProductName))
        return res.status(400).send({
          status: false,
          message: "ProductName should contain alphabets only.",
        });
      let checkproductName = await productModel.find({
        ProductName: ProductName,
      });
      if (checkproductName.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar peoduct are find by thes productName",
        });
      } else {
        return res.status(200).send({ status: true, data: checkproductName });
      }
    }
    //-------------------------------CategoryName------------------------------------
    else if (CategoryName !== undefined) {
      if (!isValid(CategoryName)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide CategoryName" });
      }
      let checkCategoryName = await productModel.find({
        CategoryName: CategoryName,
      });
      if (checkCategoryName.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar product are find by the CategoryName",
        });
      } else {
        return res.status(200).send({ status: true, data: checkCategoryName });
      }
    }
    //-------------------------------CategoryId------------------------------------
    else if (CategoryId !== undefined) {
      if (!isValid(CategoryId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide CategoryId" });
      }
      if (!isValidObjectId(CategoryId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide valid CategoryId" });
      }
      let CheckCategoryId = await productModel.findOne({
        CategoryId: CategoryId,
      });
      if (!CheckCategoryId) {
        return res
          .status(404)
          .send({ status: false, msg: "CategoryId is not exist in database" });
      }
      let productData = await productModel.find({ CategoryId: CategoryId });
      if (productData.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such product are found for this CategoryId",
        });
      } else {
        return res.status(200).send({ data: productData });
      }
    }
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports = { createProduct, getProduct };
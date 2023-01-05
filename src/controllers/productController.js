const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const {
  isValid,
  isValidRequestBody,
  nameRegex,
  numRegex,
} = require("../validator/validation");
// **********************************************CREAT PRODUCT*************************************//

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

    if (!isValidObjectId(CategoryId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid productId" });
    }

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
// **********************************************GET PRODUCT*************************************//

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
// **********************************************UPDATE PRODUCT*************************************//

const updateProduct = async function (req, res) {
  try {
    let productId = req.params.productId;
    let data = req.body;
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid productId" });
    }
    let productData = await productModel.findById({ _id: productId });
    if (!productData)
      return res
        .status(404)
        .send({
          status: false,
          message: "product is not found in the DATABASE.",
        });
    if (productData.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, msg: "Product is already deleted." });
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data for update" });
    }
    let {
      ProductName,
      CategoryName,
      description,
      price,
      currencyId,
      currencyFormat,
      installments,
      availableSizes,
    } = data;

    let bodyFromReq = JSON.parse(JSON.stringify(data));
    let newObj = {};
    // --------------------------------------ProductName validation------------------------------//
    if (bodyFromReq.hasOwnProperty("ProductName")) {
      if (!isValid(ProductName)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the ProductName" });
      }
      if (!nameRegex.test(ProductName))
        return res
          .status(400)
          .send({
            status: false,
            message: "ProductName should contain alphabets only.",
          });
      const ProductNameData = await productModel.findOne({
        ProductName: ProductName,
      });
      if (ProductNameData)
        return res
          .status(400)
          .send({ status: false, msg: `${ProductName} is already present` });
    }
    newObj["ProductName"] = ProductName;

    // --------------------------------------categoryName validation------------------------------//
    if (bodyFromReq.hasOwnProperty("CategoryName")) {
      if (!isValid(CategoryName)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the CategoryName" });
      }
      const CategoryNameData = await productModel.findOne({
        CategoryName: CategoryName,
      });
      if (CategoryNameData)
        return res
          .status(400)
          .send({ status: false, msg: `${CategoryName} is already present` });
    }
    newObj["CategoryName"] = CategoryName;
    //   --------------------------------------description validation------------------------------//
    if (bodyFromReq.hasOwnProperty("description"))
      if (!isValid(description)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter the description" });
      }
    newObj["description"] = description;
    //   --------------------------------------price validation------------------------------//
    if (bodyFromReq.hasOwnProperty("price")) {
      if (!isValid(price)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter the price" });
      }
      if (!Number(price)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide numerical price" });
      }
      if (price <= 0) {
        return res
          .status(400)
          .send({ status: false, msg: "please should not be zero" });
      }
      newObj["price"] = price;
    }
    //   --------------------------------------currencyId validation------------------------------//
    if (bodyFromReq.hasOwnProperty("currencyId")) {
      if (!isValid(currencyId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide currencyId (INR)" });
      }
      if (currencyId != "INR") {
        return res
          .status(400)
          .send({ status: false, msg: "please provide valid currencyId (INR)" });
      }
      newObj["currencyId"] = currencyId;
    }
    //   --------------------------------------currencyFormat validation------------------------//
    if (bodyFromReq.hasOwnProperty("currencyFormat")) {
      if (!currencyFormat) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide currencyFormet(₹)" });
      }
      if (currencyFormat !== "₹") {
        return res
          .status(400)
          .send({ status: false, msg: 'currencyFormat should be "₹" ' });
      }
      newObj["currencyFormat"] = currencyFormat;
    }
    //------------------------------------Installments validation---------------------------------//
    if (installments || installments === "") {
      if (!isValid(installments))
        return res
          .status(400)
          .send({ status: false, Message: "Please provide installments" });
      if (!numRegex.test(installments)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "please provide installement only numercial value",
          });
      }
      newObj["installments"] = installments;
    }
    //   --------------------------------------description validation------------------------------//
    if (bodyFromReq.hasOwnProperty("availableSizes"))
      if (!isValid(availableSizes)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: 'please provide availableSizes, Sizes should be in ["S", "XS", "M", "X", "L", "XXL", "XL"]',
          });
      }
    newObj["availableSizes"] = availableSizes;

    const updateProduct = await productModel.findByIdAndUpdate(
      { _id: productId },
      { $set: newObj },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Product updated", data: updateProduct });
  } catch (error) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// **********************************************DELETE PRODUCT*************************************//

const deleteProductById = async function (req, res) {
  try {
      let productId = req.params.productId
      if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide a valid productId." })
      let product = await productModel.findById(productId)
      if (!product) return res.status(400).send({ status: false, message: "product is not found" })
      if (product.isDeleted === true) return res.status(400).send({ status: false, message: "This product is already deleted." })

      await productModel.findOneAndUpdate(
          { _id: req.params.productId },
          { isDeleted: true, deletedAt: Date.now() })
      return res.status(200).send({ status: true, message: "product deleted succesfully." })
  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}

module.exports = { createProduct, getProduct, updateProduct, deleteProductById };

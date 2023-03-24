const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const {
  isValid,
  isValidRequestBody,
  nameRegex,
  numRegex,
  sizeRegex,
} = require("../validator/validation");
const userModel = require("../models/userModel");
// **********************************************CREAT PRODUCT*************************************//

const createProduct = async function (req, res) {
  try {
    let data = req.body;
    //------------------------------------- Distructuring------------------------------//
    const {
      userId,
      ProductName,
      CategoryName,
      CategoryId,
      description,
      price,
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
    //------------------------------------userId---------------------------------------//
    if (!isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the userId" });
    }
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid userId" });
    }
    const checkUserId = await userModel.findById(userId);
    if (!checkUserId) {
      return res.status(400).send({
        status: false,
        msg: "userId not exit in your userModel. please create userId after that you are able to creat product",
      });
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
    let checkCateName = await categoryModel.findOne({
      CategoryName: CategoryName,
    });
    if (!checkCateName) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "categoryName is not exit in your database...please create category after that you are able to creat product",
        });
    }

    // --------------------------categoryId validation----------------------------------//
    if (!isValid(CategoryId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the CategoryId" });
    }
    if (!isValidObjectId(CategoryId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid categoryId" });
    }
    const checkCateId = await categoryModel.findById(CategoryId);
    if (!checkCateId) {
      return res.status(400).send({
        status: false,
        msg: "categoryId not exit in your categoryModel. please create categoryId",
      });
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
    if (!sizeRegex.test(availableSizes)) {
      return res.status(400).send({
        status: false,
        message: "Enter a valid size S or XS or M or X or L or XXL or XL",
      });
    }
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
    let data = req.query;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        msg: "please provide any query for get product",
      });
    }
    const { ProductId, ProductName, CategoryName, CategoryId } = data;
    const queryObject = {};
    //-----------------------------ProductId-------------------------------------
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
      let CheckProductId = await productModel.findById({ _id: ProductId });
      if (!CheckProductId) {
        return res
          .status(404)
          .send({ status: false, msg: "ProductId is not exist in database" });
      }
      queryObject.ProductId = ProductId;
    }
    //--------------------------ProductName----------------------------------------
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
          msg: "No such similar product are find by thes productName",
        });
      }
      queryObject.ProductName = { $regex: ProductName, $options: "i" };
    }
    //---------------------------CategoryName---------------------------------------
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
      }
      queryObject.CategoryName = { $regex: CategoryName, $options: "i" };
    }
    //-------------------------------CategoryId-----------------------------------
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

      let checkCateId = await CategoryIdModel.findById({ _id: CategoryId });
      if (!checkCateId) {
        return res
          .status(404)
          .send({ status: false, msg: "CategoryId is not exist in database" });
      }
      queryObject.CategoryId = CategoryId;
    }
    //--------------------------pagination----------------------------------------
    let apiData = productModel.find(queryObject);
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    const myData = await apiData;
    res.status(200).send({ myData, nbHits: myData.length });
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
      return res.status(404).send({
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
        return res.status(400).send({
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
          .send({ status: false, msg: `${CategoryName} is already present please provide unique category name for update product` });
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
      if (!Number(installments)) {
        return res.status(400).send({
          status: false,
          msg: "please provide installement only numercial value",
        });
      }
      newObj["installments"] = installments;
    }
    //   --------------------------------------description validation------------------------------//
    if (bodyFromReq.hasOwnProperty("availableSizes")) {
      if (!isValid(availableSizes)) {
        return res.status(400).send({
          status: false,
          msg: 'please provide availableSizes, Sizes should be in ["S", "XS", "M", "X", "L", "XXL", "XL"]',
        });
      }
      if (!sizeRegex.test(availableSizes)) {
        return res.status(400).send({
          status: false,
          message: "Enter a valid size S or XS or M or X or L or XXL or XL ",
        });
      }
      newObj["availableSizes"] = availableSizes;
    }
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
    let productId = req.params.productId;
    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid productId." });
    let product = await productModel.findById(productId);
    if (!product)
      return res
        .status(400)
        .send({ status: false, message: "product is not found" });
    if (product.isDeleted === true)
      return res
        .status(400)
        .send({ status: false, message: "This product is already deleted." });

    await productModel.findOneAndUpdate(
      { _id: req.params.productId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: "product deleted succesfully." });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProductById,
};

const productModel = require("../models/categoryModel");
const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");
const {
    isValid,
    isValidRequestBody,
  } = require("../validator/validation");
  
//----------------------------------Create Category----------------------------------------//
const crateCategory = async function (req, res) {
  try {
    let data = req.body;
    const {CategoryName} = data;
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide category Details" });
    }
    if (!isValid(CategoryName)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the CategoryName" });
    }
    const checkCategoryName = await categoryModel.findOne({
        CategoryName: CategoryName
    });
    if (checkCategoryName)
      return res
        .status(400)
        .send({ status: false, msg: "CategoryName is already present, please provide unique category..." 
    });
    const category = await categoryModel.create(data);
    return res.status(201).send({
      status: true,
      message: "category create successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports={ crateCategory }
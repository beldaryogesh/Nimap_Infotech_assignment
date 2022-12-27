const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    CategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    CategoryId: {
      type: objectId,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    currencyId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    currencyFormat: {
      type: String,
      required: true,
      trim: true,
    },
    availableSizes: {
      type: [
        {
          type: String,
          enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        },
      ],
      required: true,
      trim: true,
      uppercase: true,
    },
    installments: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

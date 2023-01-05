const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    CategoryName: {
      type: String,
      required: true,
      unique: true
    },
    
},{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

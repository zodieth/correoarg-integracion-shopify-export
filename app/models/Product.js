import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  alto: Number,
  ancho: Number,
  largo: Number,
  peso: Number,
  valor: Number,
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;

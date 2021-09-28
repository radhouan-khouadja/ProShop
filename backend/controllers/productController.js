import Product from "../models/productModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

//  @desc      Fetch All Products
//  @get     /api/products
//  @access    public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

//  @desc      Fetch Single Product
//  @get    /api/products/:id
//  @access    public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(
    mongoose.Types.ObjectId(req.params.id)
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw Error("Product not found");
  }
});

//  @desc      delete a product by id
//  @delete    /api/products/:id
//  @access    private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(
    mongoose.Types.ObjectId(req.params.id)
  );
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw Error("Product not found");
  }
});

//  @desc      create a product
//  @post      /api/products
//  @access    private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//  @desc      update a product
//  @put       /api/products/:id
//  @access    private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(
    mongoose.Types.ObjectId(req.params.id)
  );

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
};

import Product from "../models/productModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

//  @desc      Fetch All Products
//  @get     /api/products
//  @access    public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

//  @desc      Create new review
//  @post      /api/products/:id/reviews
//  @access    private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(
    mongoose.Types.ObjectId(req.params.id)
  );

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(300);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();

    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw Error("Product not found");
  }
});

//  @desc      Create new review
//  @get       /api/products/top
//  @access    public
const getTopdProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopdProducts,
};

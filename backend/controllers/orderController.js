import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

//  @desc      Create new order
//  @route     POST /api/orders
//  @access    Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//  @desc      Get order by ID
//  @route     GET /api/orders/:id
//  @access    Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(
    mongoose.Types.ObjectId(req.params.id)
  ).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order don't exist");
  }
});

//  @desc      Update order to paid
//  @route     PUT /api/orders/:id/pay
//  @access    Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(mongoose.Types.ObjectId(req.params.id));

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order don't exist");
  }
});

//  @desc      Update order to delivred
//  @route     PUT /api/orders/:id/deliver
//  @access    Private/admin
const updateOrderToDelivred = asyncHandler(async (req, res) => {
  const order = await Order.findById(mongoose.Types.ObjectId(req.params.id));

  if (order) {
    order.isDelivred = true;
    order.delivredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order don't exist");
  }
});

//  @desc      Get logged in user order
//  @route     PUT /api/orders/myorders
//  @access    Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

//  @desc      Get all order
//  @route     Get /api/orders/
//  @access    Private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivred,
};

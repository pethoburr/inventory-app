const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

exports.item_index = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Super Sport Inventory'});
});

exports.item_list = asyncHandler(async (req, res, next) => {
    const bikes = await Item.find().populate("category").exec();
    res.render('item_list', { title: "All bikes", bike_list: bikes });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const bike = await Item.findById(req.params.id).populate("category").exec();
    res.render('item_detail', { bike_info: bike});
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create GET");
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create POST");
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item delete GET");
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: item delete GET");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create GET");
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: item create GET");
});

const asyncHandler = require("express-async-handler");
const { isObjectIdOrHexString } = require("mongoose");
const Category = require("../models/category");
const Item = require("../models/item");

exports.category_list = asyncHandler(async (req, res, next) => {
    const make = await Category.find().exec();
    res.render('category_list', { title: "All makes", make_list: make});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [bike, bikes] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id}).exec(),
    ])
    console.log(`req: ${req.params.id}, make: ${bikes}`);
    if (bikes === null) {
        const err = new Error("Make not found");
        err.status = 404;
        return next(err);
    }
    res.render('category_detail', { make_bike: bike, make: bikes});
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category create GET");
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category create POST");
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category delete GET");
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category delete GET");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category create GET");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category create GET");
});

const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

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
    res.render("category_form", { title: "Add make" });
});

exports.category_create_post = [
    body("name", "Name must be atleast 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description required")
        .trim()
        .isLength({ min: 1})
        .escape(),
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req);
            const make = new Category({ 
                name: req.body.name,
                description: req.body.description,
            });

            if (!errors.isEmpty()) {
                res.render("category_form", { title: "Add Make", make, errors: errors.array()});
                return;
            } else {
                const makeExists = await Category.findOne({ name: req.body.name }).exec();
                if (makeExists) {
                    res.redirect(makeExists.url);
                } else {
                    await make.save();
                    res.redirect(make.url);
                }
            };
        })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [bike, make] = await Promise.all([
        Item.find({ category: req.params.id}).exec(),
        Category.findById(req.params.id).exec(),
    ]);

    if (make === null) {
        res.redirect('/catalog/categorys');
    }

    res.render("category_delete", {
        title: "Delete Make",
        makers: make,
        bikes: bike
    })
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [bike, make] = await Promise.all([
    Item.find({ category: req.params.id}).exec(),
    Category.findById(req.params.id).exec()
  ]);

  if (bike.length > 0) {
    res.render("item_delete", {
        title: "Delete bike",
        makers: make,
        bikes: bike
    })
    return;
  } else {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/catalog/categorys");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const make = await Category.findById(req.params.id).exec();
    res.render("category_form", { 
        title: "Update Make",
        makers: make
    })
});

exports.category_update_post = [
    body("name", "Name must be atleast 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const make = new Category({ 
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const make = await Category.findById(req.params.id).exec();
            res.render("category_form", {
                title: "Update make",
                makers: make
            })
        } else {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, make, {});
            res.redirect(updatedCategory.url);
        }
    })
];


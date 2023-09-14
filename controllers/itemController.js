const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    const make = await Category.find().exec();
    res.render("item_form", { title: "Add bike", maker: make});
});

exports.item_create_post = [
    body("name", "Name must be atleast 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("price", "Price is required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("quantity", "Number required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Description required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("category").escape(),
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req);
            console.log(req.body.category);
            const bike = new Item({ 
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                description: req.body.description,
                quantity: req.body.quantity
            });

            if (!errors.isEmpty()) {
                res.render("item_form", { title: "Add bike", bike, errors: errors.array()});
                return;
            } else {
                const bikeExists = await Item.findOne({ name: req.body.name }).exec();
                if (bikeExists) {
                    res.redirect(bikeExists.url);
                } else {
                    await bike.save();
                    res.redirect(bike.url);
                }
            };
        })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const bikes = await Item.findById(req.params.id).populate('category').exec();
    if(bikes === null) {
        res.redirect("/catelog/items");
    }

    res.render("item_delete", {
        title: "Delete bike",
        bike: bikes
    })
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [bikey, make] = await Promise.all([
        Item.findById(req.params.id).populate('category').exec(),
        Category.find().exec()
    ]);

    if (bikey === null) {
        const err = new Error("Bike not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Add bike",
        bike: bikey,
        maker: make
    })
});

exports.item_update_post = [
    body("name", "Name must be atleast 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("price", "Price is required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("quantity", "Number required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Description required")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("category").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const bike = new Item({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const [bikey, make] = await Promise.all([
                Item.findById(req.params.id).populate("category").exec(),
                Category.find().exec()
            ]);
            console.log(bikey);
            res.render("item_form", {
                title: "Add bike",
                bike: bikey,
                maker: make
            });
            return;
        } else {
            const updatedBike = await Item.findByIdAndUpdate(req.params.id, bike, {});
            res.redirect(updatedBike.url);
        }
    })
]

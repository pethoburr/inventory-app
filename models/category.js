const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
})

CategorySchema.virtual("url").get(function () {
    return `/catalog/category/${this._id}`;
})

module.exports = mongoose.model("categories", CategorySchema);


// catalog/ (e.g. /catalog/honda/, /catalog/suzuki/, /catalog/yamaha/, )

// catalog/<id> 

// catalog/<id>/create

// catalog/<id>/update

// catalog/<id>/delete
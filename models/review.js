const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    yay: Boolean,
    nay: Boolean,
    clean: Boolean,
    unclean: Boolean,
    goodService: Boolean,
    badService: Boolean,
    details: String
});

module.exports = mongoose.model('Review', ReviewSchema);
const mongoose = require("mongoose")

const oscarSchema = new mongoose.Schema({
    name: String,
    isAnOscarWinner: Boolean,
})

const Oscar = mongoose.model("Oscar", oscarSchema)

module.exports = Oscar
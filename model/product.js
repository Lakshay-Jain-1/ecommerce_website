const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/ecoomerce").then(()=>{console.log("database connected")})

const productSchema = new mongoose.Schema({
    name:String,
    image:String,
    details:String
})
    let user = mongoose.model("products",productSchema)
    module.exports = user;


const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/ecoomerce").then(()=>{console.log("database connected")})

const productSchema = new mongoose.Schema({
    name:String,
    image:String,
    details:String
})
const customer= new mongoose.Schema({
    name:String,
    password:String 
}) 

const vendor= new mongoose.Schema({
    name:String,
    password:String 
}) 

const admin= new mongoose.Schema({
    name:String,
    password:String
}) 


    let product = mongoose.model("products",productSchema)
    let user = mongoose.model("user",customer)
    let seller = mongoose.model("vendor",vendor)
    let superadmin = mongoose.model("admin",admin)


    module.exports = {product,user,seller,superadmin};


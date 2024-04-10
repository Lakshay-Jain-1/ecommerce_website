const express = require("express")

const {join} =require("path")
const app = express()
app.use(express.static('images'))
app.use(express.static('css'))
app.use(express.static("js"))

app.get("/login",(req,res)=>{
    res.sendFile(join(__dirname,"login.html"))
})

app.get("/signup",(req,res)=>{
    res.sendFile(join(__dirname,"signup.html"))
})

app.get("/",(req,res)=>{
    res.sendFile(join(__dirname,"index.html"))
})
app.get("/cart",(req,res)=>{
    res.sendFile(join(__dirname,"cart.html"))
})

app.listen(3000,()=>{console.log("server is working")})
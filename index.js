const cookieParser = require("cookie-parser")
const express = require("express")

const {join} =require("path")
const app = express()
app.use(express.static('images'))
app.use(express.static('css'))
app.use(express.static("js"))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const authentication = (req,res,next)=>{
        console.log(req.cookies)
         if(req.cookies.loggedin){
                res.redirect("/")
         }else{
                 next()
         }
             }

app.get("/login",(req,res)=>{
    res.sendFile(join(__dirname,"login.html"))
})

app.post("/login",(req,res)=>{
    const {name, user_type}=req.body;

    res.cookie("username",name).cookie("user_type",user_type).cookie("loggedin",true).redirect("/")
    
   
})

app.get("/signup",authentication,
    (req,res)=>{
    res.sendFile(join(__dirname,"signup.html"))
})

app.post("/signup",(req,res)=>{
    console.log(req.body)
    res.redirect("/")
})

app.get("/",(req,res)=>{
    res.sendFile(join(__dirname,"index.html"))
})
app.get("/cart",(req,res)=>{
    res.sendFile(join(__dirname,"cart.html"))
})



 


app.listen(3000,()=>{console.log("server is working")})
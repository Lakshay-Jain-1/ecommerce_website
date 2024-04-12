const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const usermodel = require("./model/product");
const { join } = require("path");
const app = express();
const multer = require("multer");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const server = createServer(app);
const io = new Server(server);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    // for file name

    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static("images"));
app.use(express.json());
app.use(express.static("css"));
app.use(express.static("js"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());

const authentication = (req, res, next) => {
  if (req.cookies.loggedin) {
    res.redirect("/");
  } else {
    next();
  }
};

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
  const { name, user_type } = req.body;
  res
    .cookie("username", name)
    .cookie("user_type", user_type)
    .cookie("loggedin", true)
    .redirect("/");
});

app.get("/signup", authentication, (req, res) => {
  res.sendFile(join(__dirname, "signup.html"));
});

app.post("/signup", (req, res) => {
  res.redirect("/");
});

app.get("/", async (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/product", async (req, res) => {
  const data = await usermodel.find({});
  
  res.json(data);
});

app.delete("/delete", async (req, res) => {
  await usermodel.findByIdAndDelete(req.query.q);
});
app.get("/cart", (req, res) => {
  res.sendFile(join(__dirname, "cart.html"));
});

app.get("/vendor", (req, res) => {
  res.sendFile(join(__dirname, "vendor.html"));
});

app.post("/test", upload.single("file"), async function (req, res) {
  const { name, des } = req.body;
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  await usermodel.create({
    name,
    image: `./${req.file.filename}`,
    details: des,
  });
  
});
app.get("/rr",(req,res)=>{
    res.sendFile(join(__dirname,"tet.html"))
})
// for socket

io.on("connect",(socket)=>{
    
    socket.on("message",(text)=>{
        console.log(text)
        io.emit("message",text)
    })
    
})

server.listen(3000, () => {
  console.log("server is working");
});

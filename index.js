const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const usermodel = require("./model/product");
const { join } = require("path");
const app = express();
const multer = require("multer");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const axios = require("axios");
const uniqid=require("uniqid")
const sha256 =require("sha256")
// for hiding api keys whatnot
require("dotenv").config();
console.log(process.env.SECRET_KEY);

// UAT environment basically yeh testing enviornment hain
const MERCHANT_ID = "PGTESTPAYUAT";
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const APP_BE_URL = "http://localhost:3000";

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
  if (!req.cookies.loggedin) {
    res.redirect("/login");
  } else {
    next();
  }
};

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "login.html"));
});

app.post("/login", async (req, res) => {
  const { name, user_type, password } = req.body;

  if (user_type == 1) {
    console.log(await usermodel.user.findOne({ name }));
    if ((await usermodel.user.findOne({ name })) == null) {
      res.redirect("/signup");
    } else {
      res
        .cookie("username", name)
        .cookie("user_type", user_type)
        .cookie("loggedin", true)
        .redirect("/");
    }
  } else if (user_type == 2) {
    if ((await usermodel.seller.findOne({ name })) == null) {
      res.redirect("/signup");
    } else {
      res
        .cookie("username", name)
        .cookie("user_type", user_type)
        .cookie("loggedin", true)
        .redirect("/");
    }
  } else if (user_type == 3) {
    if ((await usermodel.superadmin.findOne({ name })) == null) {
      res.redirect("/signup");
    } else {
      res
        .cookie("username", name)
        .cookie("user_type", user_type)
        .cookie("loggedin", true)
        .redirect("/admin");
    }
  }
});

app.get("/logout", (req, res) => {
  res
    .clearCookie("loggedin")
    .clearCookie("user_type")
    .clearCookie("username")
    .redirect("/login");
});

app.get("/signup",  (req, res) => {
  res.sendFile(join(__dirname, "signup.html"));
});

app.post("/signup", async (req, res) => {
  const { name, user_type, password } = req.body;

  if (user_type == 1) {
    await usermodel.user.create({
      name,
      password,
    });
  } else if (user_type == 2) {
    await usermodel.seller.create({
      name,
      password,
    });
  } else if (user_type == 3) {
    await usermodel.superadmin.create({
      name,
      password,
    });
  }
  res.redirect("/");
});

app.get("/", authentication, async (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/product", async (req, res) => {
  const data = await usermodel.product.find({});

  res.json(data);
});
// for getting all users data for vendor
app.get("/user/data", async (req, res) => {
  const data = await usermodel.user.find({});

  res.json(data);
});

app.get("/vendor/data", async (req, res) => {
  const data = await usermodel.seller.find({});

  res.json(data);
});
//for payment
app.get("/payment", (req, res) => {
  // now we will make a post request
  // header should be this X-VERIFY   SHA256(base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index
  let transaction_id = uniqid();
  let amount = req.query.amount;

  let payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: `${transaction_id}`, // transaction id shhould be uniqye so npm uniq
    merchantUserId: "MUID123",
    amount: amount * 100, // for amount we will use query
    redirectUrl: `http://localhost:3000/recieved`,
    redirectMode: "REDIRECT",
    callbackUrl: "https://webhook.site/callback-url",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  // step 1 base64 encoded then make it into this equation  SHA256(base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index
   // make base64 encoded payload
  let bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  let base64EncodedPayload = bufferObj.toString("base64");

  // X-VERIFY => SHA256(base64EncodedPayload + "/pg/v1/pay" + SALT_KEY) + ### + SALT_INDEX
  let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
  let sha256_val = sha256(string);
  let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

  axios
    .post(
      `${PHONE_PE_HOST_URL}/pg/v1/pay`,
      {
        request: base64EncodedPayload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      console.log("response->", JSON.stringify(response.data));
      res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      res.send(error);
    });  
  

})

// for receiving money 
app.get("/recieved",(req,res)=>{
  res.send("<h1> Money is received </h1>")
})

// deleting product
app.delete("/delete", async (req, res) => {
  await usermodel.product.findByIdAndDelete(req.query.q);
});
// for cart
app.get("/cart", (req, res) => {
  res.sendFile(join(__dirname, "cart.html"));
});
// for vendor
app.get("/vendor", (req, res) => {
  res.sendFile(join(__dirname, "vendor.html"));
});

// when user uplaod data
app.post("/test", upload.single("file"), async function (req, res) {
  const { name, des } = req.body;
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  await usermodel.product.create({
    name,
    image: `./${req.file.filename}`,
    details: des,
  });
});
// for admin
app.get("/admin", (req, res) => {
  res.sendFile(join(__dirname, "superadmin.html"));
});
// for socket and communicating with admin

io.on("connect", (socket) => {
  socket.on("message", (text) => {
    console.log(text);
    io.emit("message", text);
  });
  socket.on("admin", (text) => {
    let { id, message } = text;
    console.log("textttt", text);
    io.to(id).emit("adminmessage", message);
  });
});

server.listen(3000, () => {
  console.log("server is working");
});

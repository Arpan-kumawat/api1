import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Itempost from "./SchemaItemPost.js";
import multer from "multer";
import ItempostVeg from "./SchemaVegItem.js";
import ItempostNonVeg from "./SchemaNonvegItem.js";

mongoose.set("strictQuery", false);
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect(
  "mongodb+srv://Arpan:arpan@foodorder.o4lgl0b.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected cynta");
  }
);

//image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Routes post food item
app.post("/food", upload.single("bupload"), (req, res) => {
  const new_Date = new Date().toLocaleDateString();

  const { itemName } = req.body;

  const bupload = req.file ? req.file.filename : null;

  const Itemdesc = new Itempost({
    itemName,
    bupload,
    new_Date,
  });
  Itemdesc.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: true, message: "Item Added" });
    }
  });
});

//Routes get food item
app.get("/get/food", (req, res) => {
  Itempost.find()
    .then((data) => {
      res.send({ status: true, message: "Success", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Something Went Wrong !", data: [] });
    });
});

//Routes post veg food item
app.post("/vegfood", upload.single("vegupload"), (req, res) => {
  const new_Date = new Date().toLocaleDateString();

  const { itemName, itemPrice } = req.body;

  const vegupload = req.file ? req.file.filename : null;

  const Itemdesc = new ItempostVeg({
    itemName,
    vegupload,
    new_Date,
    itemPrice,
  });
  Itemdesc.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: true, message: "Item Added" });
    }
  });
});

//Routes get veg food item
app.get("/get/vegfood", (req, res) => {
  ItempostVeg.find()
    .then((data) => {
      res.send({ status: true, message: "Success", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Something Went Wrong !", data: [] });
    });
});

//Routes post Nonveg food item
app.post("/nonvegfood", upload.single("nonvegupload"), (req, res) => {
  const new_Date = new Date().toLocaleDateString();

  const { itemName, itemPrice } = req.body;

  const nonvegupload = req.file ? req.file.filename : null;

  const Itemdesc = new ItempostNonVeg({
    itemName,
    nonvegupload,
    new_Date,
    itemPrice,
  });
  Itemdesc.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: true, message: "Item Added" });
    }
  });
});

//Routes get Nonveg food item
app.get("/get/nonvegfood", (req, res) => {
  ItempostNonVeg.find()
    .then((data) => {
      res.send({ status: true, message: "Success", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Something Went Wrong !", data: [] });
    });
});

app.all("/", (req, res) => {
  res.send("Yo!");
});

app.listen(process.env.PORT || 9002, () => {
  console.log("BE started at port 9002");
});

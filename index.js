import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Itempost from "./SchemaItemPost.js";
import multer from "multer";
import ItempostVeg from "./SchemaVegItem.js";
import ItempostNonVeg from "./SchemaNonvegItem.js";
import user4 from "./Schemnaregister.js"

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



const voiceSchema = new mongoose.Schema({
  name: String,
  voiceUrl: String,
   new_Date:String
  // other fields as per your requirements
});

// Create a model based on the schema
const Voice = mongoose.model('Voice', voiceSchema);

app.get('/voices/:id', async (req, res) => {
  try {
    const voice = await Voice.findById(req.params.id);
    if (!voice) {
      return res.status(404).json({ error: 'Voice not found' });
    }
    res.json(voice);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Routes get voices
app.get("/get/voices", (req, res) => {
  Voice
    .find()
    .then((data) => {
      res.send({ status: true, message: "Success", data: data });
      // res.status(200).json({
      //     data
      // });
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //     error: err
      // })
      res.send({ status: false, message: "Something Went Wrong !", data: [] });
    });
});


//Routes post food item
app.post("/post/voices", (req, res) => {
  const { name, voiceUrl } = req.body;

  const new_Date = new Date().toLocaleDateString();
  const voiceApi = new Voice({
    name,
    voiceUrl,
    new_Date,
  });
  voiceApi.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: true, message: "voiceApi update " });
    }
  });
});

//Routes register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  user4.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" });
    } else {
      const new_Date = new Date().toLocaleDateString();
 
      const user23 = new user4({
        name,
        email,
        password,
        new_Date
      });
      user23.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});

//Routes login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  user4.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});


app.all("/", (req, res) => {
  res.send("Yo!");
});

app.listen(process.env.PORT || 9002, () => {
  console.log("BE started at port 9002");
});

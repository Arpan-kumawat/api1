import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Itempost from "./SchemaItemPost.js";
import multer from "multer";
import ItempostVeg from "./SchemaVegItem.js";
import ItempostNonVeg from "./SchemaNonvegItem.js";
import user4 from "./Schemnaregister.js"
import fileUpload from 'express-fileupload';
import ExcelJS from 'exceljs';
import axios from 'axios';
// const dotenv = require('dotenv');
// dotenv.config({ path: __dirname+'/.env' });

mongoose.set("strictQuery", false);
const app = express();
// const fileUpload = require('express-fileupload');
app.use(express.json());
app.use(express.urlencoded());
app.use(fileUpload());
app.use(cors());
app.use("/uploads", express.static("uploads"));



// const ExcelJS = require('exceljs');
// const axios = require('axios');










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


//gpt api Jll

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const RANDOMUSER_API_URL = 'https://randomuser.me/api/?results=100';
const API_KEY = process.env.API_CONNECTION_STR; // Remember to use your actual OpenAI API Key

// Existing endpoint for analysis
app.post('/getAnalysis', async (req, res) => {
    const file = req.files.sampleFile;
    const sampleData = file.data.toString('utf8').split('\n').map(line => line.split(','));
    const headers = sampleData[0];
    
    try {
        const prompt = `Provide a brief analysis for a CSV with headers: ${headers.join(", ")}.`;
        
        const openaiResponse = await axios.post(OPENAI_API_URL, {
            model: "gpt-4",
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'User-Agent': 'OpenAI-Node-Client',
            }
        });
        
        let analysis = openaiResponse.data.choices[0].message.content.trim();

        // Limit the analysis to a maximum of 7 lines
        analysis = analysis.split('\\n').slice(0, 7).join('\\n');

        // Append a prompt asking the user for changes
        analysis += "\\n\\nWhat changes or actions would you like to take based on this analysis?";

        res.json({ analysis });

    } catch (error) {
        console.error('Error fetching analysis:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/generateExcel', async (req, res) => {
    try {
        // Fetch analysis from OpenAI
        const headers = ["Title", "Name", "Email", "Status", "DOB"]; // Modify this based on your CSV headers
        const prompt = `Provide a brief analysis for a CSV with headers: ${headers.join(", ")}.`;
        
        const openaiResponse = await axios.post(OPENAI_API_URL, {
            model: "gpt-4",
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'User-Agent': 'OpenAI-Node-Client',
            }
        });

        let openaiDataText = "";
        if (openaiResponse.data.choices && openaiResponse.data.choices[0].message && openaiResponse.data.choices[0].message.content) {
            openaiDataText = openaiResponse.data.choices[0].message.content.trim();
        }
        const openaiData = openaiDataText.split('\\n').map(line => line.split(','));

        // Fetch random users
        const randomUsersResponse = await axios.get(RANDOMUSER_API_URL);
        const randomUsers = randomUsersResponse.data.results;
        const randomUserData = randomUsers.map((user) => {
            return [
                ["Mr.", "Mrs.", "Dr.", "Miss", "Prof."][Math.floor(Math.random() * 5)],
                `${user.name.first} ${user.name.last}`,
                user.email,
                ["complete", "incomplete"][Math.floor(Math.random() * 2)],
                new Date(user.dob.date).toLocaleDateString('en-GB') // Format: DD/MM/YYYY
            ];
        });

        // Combine OpenAI data with RandomUser data
        const combinedData = [...openaiData, ...randomUserData];

        // Create an Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Generated Data');

        // Add headers to the worksheet
        worksheet.addRow(headers);

        // Add combined data to the worksheet
        combinedData.forEach(row => worksheet.addRow(row));

        // Write the Excel file to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set the response headers and send the buffer
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=out.xlsx');
        res.send(buffer);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});







app.all("/", (req, res) => {
  res.send("Yo!");
});

app.listen(process.env.PORT || 9002, () => {
  console.log("BE started at port 9002");
});

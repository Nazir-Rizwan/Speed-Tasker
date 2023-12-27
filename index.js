const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const dotenv = require("dotenv").config();
var validator = require("validator");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const bodyparser= require("body-parser");


app.use(express.static("uploads"))


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());


//  connection database config file require
require("./db/config")


const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));




const { Schema, model } = mongoose;






app.get("/hello",(req,res)=>{
console.log(req.url,req.method)
console.log(req.body)
res.setHeader("Content-Type",'text/html');

res.send(req.cookies.jwtoken)
//res.write("heeo ")
// res.redirect('/api')

//res.send("hlhdlas")
//res.end()
})



const userroute= require("./routes/Regrouter.js")

app.use("/client",userroute);



const programer = Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    unique:true,
  },
  college: {
    type: String,
    require: true,
  },
  rollno: {
    type: Number,
    default: 122,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Email must be a valid email address",
    },
  },
});

programer.pre("save",async function(next){
  try{

    console.log("Called Before Save user ")
  }catch(err)
  {
    next(err)
  }
})

const prog = model("Programmer", programer);

const postStudent = async () => {
  try {
    const craeteprogram1 = new prog({
      name: "nazir",
      college: "punjab",
      email: "mrjk@gmail.com",
    });

    const craeteprogram2 = new prog({
      name: "ali",
      college: "kips",
      email:"a@kips.com",
    });
    const craeteprogram79 = new prog({
      name: "        comsats  m  Sahiwal          ",
      college: "kips",
      email: "mrjk@gmail.com",
    });
    
    //const studentdata= await  prog.insertMany([craeteprogram1,craeteprogram2,craeteprogram3])
    //console.log(studentdata);
    // craeteprogram.save();

   
  //  await craeteprogram2.save();


   




    console.log("send successful");
  } catch (err) {
    console.log(err.message);
  }
};





const bcrypt = require("bcryptjs")








async function fetchall() {
  const data = await prog
    .find({ rollno: 150 }, null, { limit: 0 })
    .sort({ name: 1 });
  //  sort 1 for acending and 2 for descending
  console.log(data);
}

//fetchall();

async function updatedoc(roll) {
  const updatestudent = await prog.updateOne(
    { rollno: roll },
    { $set: { rollno: 150 } }
  );

  console.log(updatestudent);
}

//updatedoc(122);

app.listen(5000, () => `node server use nodemon runing port`);







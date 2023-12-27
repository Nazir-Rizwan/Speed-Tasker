const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

try {
    url = process.env.DB;
    mongoose.connect(url
    ,{
  autoIndex:true,
    }).then((data) => {
      console.log("Connect");
    })
  } catch (e) {
    console.log("error connecting");
  }
  
const mongoose =require("mongoose");

const professional_schema=mongoose.Schema({
name:{
    type:String,
    require:true
},

address:{
    type:String,
    require:true
},
category:{
    type:String,
    require:true
},
work:{
    type:String,
    require:true
},
summary:{
    type:String,
    require:true
},
price:{
    type:Number,
    require:true
},
image:{
    type:String,
    require:true
}


})

 const professional_user=mongoose.model('image',professional_schema)

module.exports=professional_user

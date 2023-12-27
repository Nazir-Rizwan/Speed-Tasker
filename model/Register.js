const mongoose=require("mongoose")
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Schema,model}=mongoose;

const register=Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ]

})

register.pre("save",async function(next){

    if(this.isModified('password'))
    {
        //  this => refer to an instance of document created 
        //  this => refer to this field 
console.log(`That is current password ${this.password}`);
 this.password = await bcrypt.hash(this.password,10);
console.log(`That is current password ${this.password}`)
    }    
next()
})

//  this = > current each input user register  about to save
//  this= > point to current user document  

//  we are generate JWT Token 
register.methods.generateAuthToken=async function(){
    try{
//let tokennazir= jwt.sign({_id:this._id},"mynameisnazir")
 let token= jwt.sign({_id:this._id},"mynameisnazir")
//let token= jwt.sign({_id:this._id},"mynameisnazir",{expiresIn:"15m"})
this.tokens=this.tokens.concat({token:token})
await this.save();
return token 
    }catch(err)
    {
        console.log(err)
    }
}



const user = model("register",register )



module.exports=user;



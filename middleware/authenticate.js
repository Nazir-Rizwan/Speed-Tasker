const jwt=require("jsonwebtoken")
const user=require("../model/Register")
// const cookieParser = require("cookie-parser");
// const express = require("express");
// const app = express();
// app.use(cookieParser())



//  logout code 
// router.get('/logout', function(req, res) {
//   res.status(200).send({ auth: false, token: null });
// });



const authenticate=async(req,res,next)=>{
    
    try{
const token= req.cookies.token;
console.log(token)

const verifytoken=jwt.verify(token,"mynameisnazir")

console.log(verifytoken)

if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

// const verifytoken=jwt.verify(token,"mynameisnazir")

// req.user=verifytoken;


// if(!rootuser) {throw new Error("User not found")}
// req.token=token;
// req.rootuser=rootuser;
// req.userID=rootuser._id;




  // Get token from header

//   const token =
//   req.body.token || req.query.token || req.headers["x-access-token"];
//  const tkn= req.cookies.jwtoken;
//    console.log(tkn)
// // console.log(token)
//   // Check if no token
//   if (!tkn) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }
// // Verify token
  // try {
  //   const decoded = jwt.verify(token, "mynameisnazir");
  //   req.user = decoded;
  // } catch (err) {
  //   console.error('something wrong with auth middleware');
  // return  res.status(500).json({ msg: 'Server Error' });
  // }


const rootuser= await user.findOne({_id:verifytoken._id ,"tokens.token":token})
if(!rootuser) {throw new Error("User not found")}
req.token=token;
req.rootuser=rootuser;
req.userID=rootuser._id;


// next();
}
catch(err)
{
  return  res.status(401).send("Unable to authenticate No Token")
    console.log(err)
}

next();

}

module.exports=authenticate;
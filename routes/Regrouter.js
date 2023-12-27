const user= require("../model/Register");
const express = require("express");
const router = express.Router();
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const authenticate= require("../middleware/authenticate")
const multer= require("multer")
const professional_user=require("../model/Imageu")

const stripe=require("stripe")(process.env.STRIPE_SECRET);

//  const upload= multer({dest:"uploads/"})
const app=express();
app.use(express.urlencoded({extended:false}))


router.post("/reg",async(req,res)=>{
    const {name,email,password}=req.body;

    // res.setHeader("Content-Type",'application/json');
   if(!name||!email||!password){
   console.log(req.body)
    return  res.status(422).json({error:"Plz Filled All Record"})
   }    
   try{
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.password);

const userexist=await user.findOne({email:email})
if(userexist)
{
    console.log(req.body)
    return   res.status(422).json("User ALready Exists")  
}
else{
    const register= user({name,email,password})
    await register.save();
    //user.save ((err,user)=>{})   aisa function la pehla argument error hota or dosra successfully 
    //if(err){Failed to add user} else {user added }
    console.log("Registered user save success")
    res.status(201).json({message:"User register successfully"});
}
   }
   catch(err)
   {
   
    console.log("error catch log")
   
   return res.status(422).json({error:"User Catch Error"});

    
   }
 })


router.post("/log",async(req,res)=>{
       
    let token;
        try{

            const {email,password}=req.body;
    
           
            if(!email || !password)
            {
        //   return  res.status(422).json({message:"Plz Filled Detail"}) 
         return res.json({message:"Plz Filled Detail"})   
         // ager hum axios ma response chata h to status code sath an likha
            }


            
// const userexist=await user.findOne({email:email})
const userexist=await user.findOne({email:email})
console.log("user find ")



//  ager hum wese kisi or ka use kare to phir 
//  user.findOne ({email:email},function(err,user))   aisa function la pehla argument error hota or dosra successfully 
//  if(user==null){ "usernot found "} else user logging 



            console.log(userexist)
            if(userexist)
            {
                const isMatch=await bcrypt.compare(password,userexist.password)
               
            //   const payload={
            //     userexist:{
            //         id:userexist._id,
            //     },

            //   }
           
            // const tok= jwt.sign( {userexist_id:userexist._id},"jwt-secret-key",{expiresIn:"5m"})
            //  res.cookie("token",token,{
            //     httpOnly:true,
            //      withCredentials:true
                
            //     })
            //     console.log(tok)
           
            //   // save user token
            //    userexist.token = token;



              
              
            //   const token = await jwt.sign(
            //     { user_id: userexist._id },
            //     "nazirnlshfh",
            //     {
            //       expiresIn: "2h",
            //     }
            //   );
            //      console.log(token)
                
                // let token= jwt.sign({id:userexist._id},"mynameisnazir")
              
                //  ya wala code sai chalta ha 
                const token = await userexist.generateAuthToken();
                
                res.cookie("token",token,{
                expires: new Date(Date.now()+2098311782036),
                // 25892000000 mili second 
                httpOnly:true,
                 withCredentials:true
                })


                  //put token in cookie
    // res.cookie("token", token, { expire: new Date() + 9999 });
                //  res.status(200).json({message:"User Signed in successfully",success:true})
                   



                if(isMatch)
                {
                  return res.json({message:"Login Success"})

                }
                else{
                    return res.json({message:"Invalid Password"}) 
                    //  422 status code 
                    }
             
            }
            else{
                return res.json({message:"No account Registered"})
                //  status => code 422  
            }

        }catch(err)
        {
            return res.status(422).json({message:"Catch Enter Correct Data"}) 
        }
    
    })

//  about us page 
router.get('/about',authenticate,(req,res)=>{
    console.log("Hello my about us page ")
    
    // return res.send("Hello my ab4out us page")
    return res.send(req.rootuser)
}) 




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix=Date.now();
      cb(null, uniqueSuffix  + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.post("/profile",upload.single('file'),async(req,res)=>{
    
    try{

    
    console.log(req.body)
const {name,address,category,work,summary,price,ip}=req.body;

  console.log(req.file)

     const imgfile= professional_user.create({name,address,category,work,summary,price,ip,image:req.file.filename});
 await imgfile.save();
return  res.send("success file send ")
    }
    catch(err)
    {
     return  res.send("error creating Again Fill ")
    }
})

router.get("/getimage",(req,res)=>{ 
    try{
        professional_user.find().then(user=>res.json(user))
    }
    catch(err)
    {
        res.message("error Fetching Images ")
    }
       
})



router.get("/delete/:id",async(req,res)=>{
    try{
console.log("kaya issue ha")
         const id=req.params.id;
        
    const itemdel=await  professional_user.deleteOne({_id:id})
    console.log(itemdel)
    return  res.status(200).json({message:"item deleted successfully"})

    
    }catch(err)
    {
    return  res.status(422).json({error:"catch Deleter by id  user"})  
    }
})


router.get("/showone/:id",async(req,res)=>{
    try{
console.log("kaya issue ha")
         const id=req.params.id;
        
    const itemdel=await  professional_user.findOne({_id:id})
    console.log(itemdel)
    return  res.status(200).json({message:" Show Detailed successfully"})

    
    }catch(err)
    {
    return  res.status(422).json({error:"catch Show by id  user"})  
    }
})







router.put("/update/:id",upload.single('file'),async(req,res)=>{
    try{

        // if(req.file!==undefined)
        // {
const id= req.params.id;
const file= req.file.filename;
console.log(file)
// await imagesuser.findByIdAndUpdate({_id:id},{$set:{image:file}})
await professional_user.updateOne({_id:id},{$set:{image:file}})

return  res.status(200).json({message:"image post successfully update "})
        // }
        // else{
        //     return  res.status(200).json({message:"image not defined "})
        // }
        

    }catch(err)
    {
    return  res.status(422).json({error:"catch Deleter by id  user"})  
    }
})


router.get('/detail/:id',async(req,res)=>{
   
    // const userid= req.query.id;
    const id= req.params.id;
           try{
            //   console.log(req)
      
       const user =await professional_user.findById({_id:id})
       res.json(user);
       }
       catch(err){
       return res.status(400).json({message: `error nai ho ra a${err}`})
       }
      })




router.get("/nazir",(req,res)=>{
    // res.clearCookie("token")
    console.log("nazir redirect")
    
      return res.json("nazir success")
})

router.get("/",authenticate,(req,res)=>{
   
    
        console.log("lhaflahfl")
          res.send(req.rootuser)
    // }
    // catch(err)
    // {
    //     console.log("Logout Catch Error Generate ")
    // }
   
})


router.post("/stripecheckout",async(req,res)=>{
    // res.clearCookie("token")
    try{
        const {item}=req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1099,
            currency: 'usd',
            payment_method_types: ['card'],
          });
       
       
        
        res.send({clientSecret:PaymentIntent.client_secret})
        //  
    }
    catch(err)
    {
        return res.json("Stripe Payment Error")
    }
   
})




router.get("/logout",(req,res)=>{
    // res.clearCookie("token")
    try{
        console.log("logout")
         res.clearCookie("token")
        // res.redirect("/a/nazir")
         return res.json("success")
    }
    catch(err)
    {
        console.log("Logout Catch Error Generate ")
    }
   
})






module.exports=router;


//----------------------------
//  if you want to logout then you have expiry date  


// const logoutUser = (req, res) => {
//     res.cookie('jwt', '', {
//       httpOnly: true,
//       expires: new Date(0),
//     });
//     res.status(200).json({ message: 'Logged out successfully' });
//   };
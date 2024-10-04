if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const bodyParser = require('body-parser');   

app.use(bodyParser.json()); // Parse JSON bodies

const listings=require("./routes/listing.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const wrapAsync=require("./utils/wrapasync.js");
//const {listingSchema ,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/expressError.js");
//const Listing = require("./models/listing.js");
const Listing = require("./models/listing.js");

//const Review=require("./models/review.js")
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const MONGO_URL=process.env.ATLASDB_URL;
// const MONGO_URL="mongodb://127.0.0.1:27017/wander";
//call function//
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
console.log(err);
});



async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON bodies ko parse karne ke liye middleware

app.use(methodOverride("_method"));

app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")));



//validate listing conver middle ware//
const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
//  console.log(result);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else {
    next();
  }
}

const store=MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});


//sesstion option//
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
cookie:{
  expires:Date.now()+7 * 24 * 60 * 60 * 1000,
  maxAge:7 * 24 * 60 * 60 * 1000,
httpOnly:true,
},
};






app.use(session(sessionOptions));
app.use(flash());  

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());  


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
 })
 

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

// app.get("/",(req,res)=>{
//   res.send("hi ,i am root");
// });





// app.post("/listings", 
//   validateListing,
//   wrapAsync ( async (req, res,next) => {
//     // console.log("Inside Create Route"); // Debugging

//     //     console.log("Request Headers:", req.headers); // Debugging ke liye headers log karein
//     //     console.log("Request Body:", req.body); // Debugging ke liye log karein

//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Listing is required");
//     // }
//     const newListing = new Listing(req.body.listing);
//   await newListing.save()

//   .then(() => {
//     req.flash('success', 'New Listing Created');
//     res.redirect('/listings');
// })
// .catch(err => {
//     console.error('Error saving listing:', err);
//     req.flash('error', 'Failed to create listing');
//     res.redirect('/error');
// });


  // req.flash("success","New Listing Created");
  // res.redirect("/listings");
  
  
  
// })
// );









app.all("*",(req,res,next)=>{
  next (new ExpressError(404,"page Not Found"));
  });
//error handler
app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something went wrong"}=err;
 
 res.status(statusCode).render("error.ejs",{message});
  // res.send("something went wrong");
});


app.listen(8080,()=>{
    console.log("server is listening to port 8000");
}) 

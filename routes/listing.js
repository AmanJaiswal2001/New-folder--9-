const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const {listingSchema }=require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");

const {isLoggedIn, isOwner}=require("../middleware.js")

const Controller=require("../Controller/listing.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//validate listing conver middle ware//
const validateListing=(req,res,next)=>{
  console.log("Request Body:", req.body); // Debugging request body
  
    let {error}=listingSchema.validate(req.body);
  //  console.log(result);
    if(error){
      console.log("Validation Error:", error); // Log the validation error for debugging
        
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else {
      next();
    }
  }


//Index Route
// // // router.get("/",
// //   wrapAsync(Controller.index),
  
// );
 // New Route
router.get("/new",isLoggedIn, Controller.renderNewForm);
  


//router.route use//


router.route("/")

.get(
  wrapAsync(Controller.index),
  
)
.post( 
  isLoggedIn,
 // validateListing,
  upload.single('listing[image]'),
  wrapAsync (Controller.createForm));

// .post( upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
// });

//id route//
router.route("/:id")

.get(
  wrapAsync(Controller.showForm)
)
.put(
 isLoggedIn,
    isOwner,
   // validateListing,
   upload.single('listing[image]'),

   wrapAsync(Controller.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(Controller.deleteListing)
)

  //Show Route
  // router.get("/:id", 
  //   wrapAsync(Controller.showForm)
  // );
  
  //Create Route
  // router.post("/", 
  //   validateListing,
  //   isLoggedIn,
  //   wrapAsync ( async (req, res,next) => {
  //     // console.log("Inside Create Route"); // Debugging
  
      //     console.log("Request Headers:", req.headers); // Debugging ke liye headers log karein
      //     console.log("Request Body:", req.body); // Debugging ke liye log karein
  
      // if (!req.body.listing) {
      //     throw new ExpressError(400, "Listing is required");
      // }
    //   const newListing = new Listing(req.body.listing);
    //   newListing.owner=req.user._id;
    // await newListing.save();




    // req.flash("success","New Listing Created");
    // res.redirect("/listings");
    
    
    
//   })
// );
  
  //Edit Route
  router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(Controller.editForm)
  );
  
  //Update Route
  // router.put("/:id", isLoggedIn,
  //   isOwner,
  //   validateListing,
  //  wrapAsync(Controller.updateListing)
  // );
  //Delete Route
  // router.delete("/:id", isLoggedIn,
  //   isOwner,
  //   wrapAsync(Controller.deleteListing));


  module.exports=router;
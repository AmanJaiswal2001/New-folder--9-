 const express=require("express");
 const router=express.Router({mergeParams:true});


 const wrapAsync=require("../utils/wrapasync.js");
 const {reviewSchema}=require("../schema.js");
 const ExpressError = require("../utils/expressError.js");
 const Listing = require("../models/listing.js");
 

 const Review=require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const controller=require("../Controller/reviews.js");



 const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
  //  console.log(result);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else {
      next();
    }
  }











  //reviews//

  router.post("/", 
    isLoggedIn,
    validateReview ,wrapAsync(controller.createReviews));
 
  //delete review route//
 
  router.delete(
   "/:reviewId",
   isLoggedIn, 
   isReviewAuthor,
   wrapAsync(controller.deleteReviews));
 


  module.exports=router;
const Listing=require("./models/listing");
const Review=require("./models/review");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login");
      } 
      next();
    };

    module.exports.saveRedirectUrl=(req,res,next)=>{
                if(req.session.redirectUrl){
                    res.locals.redirectUrl=req.session.redirectUrl;
                } else {
                    res.locals.redirectUrl = '/listings'; // Set a default redirect URL if session redirect URL is not set
                  }
                  next();
                };
                
            module.exports.isOwner= async(req,res,next)=>{
                let { id } = req.params;
                let listing=await Listing.findById(id);
                if (!listing.owner.equals(req.user._id)) {
                  req.flash("error", "You don't have permission to edit this listing.");
                  return res.redirect(`/listings/${id}`);
              }
              next();
            }


            module.exports.isReviewAuthor= async(req,res,next)=>{
                let { id,reviewId } = req.params;
                let review=await Review.findById(reviewId);
                if (!review.author.equals(req.user._id)) {
                  req.flash("error", "You are not the author of this review.");
                  return res.redirect(`/listings/${id}`);
              }
              next();
            }
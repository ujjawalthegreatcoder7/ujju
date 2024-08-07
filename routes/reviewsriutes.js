const express           =  require("express") ;
const router            = express.Router({mergeParams : true}) ;
const {listingSchema,
    reviewSchema }      =  require("../schemaforjoi.js")
    const wrapAsync     =  require("../utils/wrapAsync")  // isse ek yeah fayda bhi hoga ki error aane par humara server crash nhi hoga bs message print goga
    const Listing       =  require("../models/listings")
    const Review        =  require("../models/review") 
    const {isLoggedIn}  = require("../views/middleware/middlewaree")
const modelviewcontrollerreview =require("../controllers/review")

    const isReviewAuthor = async(req,res,next) => {
        let {id,reviewId} = req.params ;
        let review     = await Review.findById(reviewId) 
        if(!review.author.equals(res.locals.curruser._id)) {
          req.flash("error" , "You are not author of this review" )
          return res.redirect(`/listings/${id}`) ;
        }next() ;
      }
      

//for creating route  
const validatereview = (req,res,next) => {   // it is joi for reviews
    let {error} = reviewSchema.validate(req.body) ;
    console.log(error) ;
    if(error) {
        let errmsg = error.details.map((el) => el.message ).join(",") ;
        throw new ExpressError(400,errmsg) ;
    }
    else {
        next() ;
    }
}


// REVIEWS
//POST ROUTE 
router.post("/",isLoggedIn,
    validatereview ,
     wrapAsync( modelviewcontrollerreview.reviewpost ) )

//RWEVIEW DELETE  
router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor,
     wrapAsync( modelviewcontrollerreview.delete))



module.exports = router


























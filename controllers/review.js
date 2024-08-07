const Review = require("../models/review")
const Listing = require("../models/listings")

module.exports.reviewpost = async (req,res) => {

      

    console.log(req.params.id) ;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review) // example name = review[price]   jo maine input mein likha hai
   
    newReview.author = req.user._id
    listing.reviews.push(newReview) 

    newReview.save() ;
    await listing.save() ;
    console.log("new review saved")
    req.flash("Success" , "U have created review" ) ;
    console.log(newReview)
    res.redirect(`/listings/${listing._id}`)
} 


module.exports.delete = async (req,res) => {
    let {id,reviewId} = req.params ;
    req.flash("Success" , "U have deleted review" ) ;
    await Review.findByIdAndDelete(reviewId) ;
    res.redirect(`/listings/${id}`)
} 





















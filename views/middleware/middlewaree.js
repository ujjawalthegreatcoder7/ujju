// const Listing = require("./views/models/listings")

// const Review = require("../models")

module.exports.isLoggedIn = (req,res,next) => {
// console.log(req.path,"..",req.originalUrl)  // req.originalUrl hume direct usi page [ar lekar jaayega uha umejaana hai ]
if ( !req.isAuthenticated() ) {  // isAuthenticated is a passport library function that help to chexk that is it loggin or not

    req.session.redirectUrl = req.originalUrl

    req.flash("error" , "you must be logged-in to create Listing!" )
    return res.redirect("/login")
    }
    next() ;
} ;


module.exports.saveRedirectUrl = (req,res,next) => {
      if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
      }next() ;
} ;

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params ; //params = parameter 
    let Listing =await Listing.findById(id) ; 

    if(!Listing.owner.equals(res.locals.curruser._id)){
       req.flash("error" , "You dont have permiddion to edit" )
       return res.redirect(`/listings/${id}`)
    }

}

// module.exports.isReviewAuthor = async(req,res,next) => {
//   let {id,reviewId} = req.params ;
//   let review     = await Review.findById(reviewId) 
//   if(!review.author.equals(res.locals.currUser._id)) {
//     req.flash("error" , "You are not author of this review" )
//     return res.redirect(`/listings/${id}`) ;
//   }next() ;
// }

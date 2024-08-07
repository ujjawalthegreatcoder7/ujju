const mongoose = require("mongoose") ;
const Review = require("./review.js")

const listingSchema = new mongoose.Schema ({
    title : {
        type : String ,
        required : true , 
    } ,
    description : {
        type : String ,
    } ,
    image : {
        //  type : String ,
        // default : "https://tse4.mm.bing.net/th?id=OIP.FMXRWeIBY5dvBMTvJU4ltQHaE6&pid=Api&P=0&h=180" , 
        // set : (v) => 
        //     v === ""
        // ?"https://tse3.mm.bing.net/th?id=OIP.5R4QhVFTTNrs86CdhEpc2gHaLH&pid=Api&P=0&h=180" 
        // : v , 

url : String, 
filename : String

    } ,
    price    : Number ,
    location : String ,
    country  : String , 
 
 reviews :[
{
    type : mongoose.Schema.Types.ObjectId ,
    ref : "Review" ,
}
 ],
  
 owner : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" ,
 } ,

 geometry : {
    type : {
        type : String ,
        enum : ["Point"] ,
        required : true
    },
    coordinates : {
        type : [Number] ,
        required : true 
    }
 } ,

//  category : {
//     type : String ,
//     enum : ["Trending" , "Rooms" ,"Mountains" ,"Castles" ,"Swimming" ,"Camping" ,"Farms" ,"Arctic"]
//  }

}) ;


listingSchema.post("findOneAndDelete" , async (listing) => {   // vaise yeah reviews k liye hai ki jab listing delete ho tb review bhi delete ho jaaye 
    if(listing) {
        await Review.deleteMany({_id:{ $in : listing.reviews}})
    }
} )

const Listing = mongoose.model("Listing" , listingSchema ) ;
module.exports = Listing ;

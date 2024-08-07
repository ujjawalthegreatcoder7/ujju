const Listing             =     require("../models/listings")
const mbxGeocoding        =     require('@mapbox/mapbox-sdk/services/geocoding') ;
const mapToken            =     process.env.MAP_TOKEN ; 
const geoCodingClient     =     mbxGeocoding({ accessToken : mapToken  });

     module.exports.index  = async(req,res) => {    
     const allListings = await Listing.find({})
     // res.send(" RADHA k krishna ")
     res.render("./listings/index.ejs" , {allListings} )
     } 

     module.exports.new =  (req,res) => {
     res.render("listings/new")
     }

     module.exports.index = async(req,res) => {    
     const allListings = await Listing.find({})
     // res.send(" RADHA k krishna ")
     res.render("./listings/index.ejs" , {allListings} )
     } 

    module.exports.create = async(req,res) => {    // isme humne wrapAsync method nhi lgaya hum lga sakte hai lekin maine nhi lgaya
    // let listing = req.body.listing ;  // is k through hum input vali saara text mongoose mein daal sakte hai
   
    let response = await geoCodingClient.forwardGeocode({  // forwardGeocode iska matlab yeah hai ki aap isme jagah ka name daaloge phir vo apne aap coordinate return krdega 
        query : req.body.listing.location , // maximum u can enter 2 locations
        limit :  1,               // maximum it will return 1 coordinates
    })
    .send()  
    
    console.log(response.body.features[0].geometry) ;

    let url = req.file.path ;
    let filename = req.file.filename ;
    console.log(url, ".." , filename ) ;//  is ki vajah se main hume llink milega ab us link ko use krenge

    // if(!req.body.listing) {
    //     throw new ExpressError(400 , "Send valid data for LISTING" )
    // }
    const newListing = new Listing(req.body.listing) ;
    newListing.owner = req.user._id ;
    newListing.image = {url,filename}

    newListing.geometry = response.body.features[0].geometry

   let savedlisting= await newListing.save() ;
   console.log(savedlisting)

    // if(!newListing.description) {                      // ab hum if and else k lava hum joi use kar sakte hai   JOI
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }

    // if(!newListing.title) {
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }

    // if(!newListing.location) {
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }

    // if(!newListing.country) {
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }

    // if(!newListing.price) {
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }

    // if(!newListing.image) {
    //     throw new ExpressError(404 , "Send valid data for Description" )
    // }
    
  req.flash("Success" , "U have created new route" ) ;
    res.redirect("/listings") ;
    }


module.exports.show = async ( req,res ) => {
    let {id} = req.params ; //params = parameter 
    const listing = await Listing.findById(id)
    .populate({ path : "reviews" , populate : "author" } ) 
    .populate("owner")  ;

    if( !listing ){
        req.flash("error" , "this listing do not exist any more!" ) ;
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show" , {listing} ) ;
    // res.send("radhaji")
    }  


    module.exports.edit = async (req,res) => {
    let {id} = req.params ;
    console.log("RADHAji") ;
    const listing = await Listing.findById(id)
    if( !listing ){
        req.flash("error" , "this listing do not exist any more!" ) ;
        res.redirect("/listings")
    }

let originalimageurl = listing.image.url ;
originalimageurl = originalimageurl.replace("/upload" , "/upload/h_300,w_250" )

    res.render("./listings/edit", {listing ,originalimageurl }  )
} 


module.exports.delete = async (req,res) => {
    let {id} = req.params ;
    let deletedListing = await  Listing.findByIdAndDelete(id)
    // res.send("radha ji")
    console.log(deletedListing)
    req.flash("Success" , "U have deleted route" ) ;
    res.redirect( `/listings` ) ;   
}































      
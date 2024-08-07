// we have model view controller concept 

const express                = require("express") ;
const router                 = express.Router() ;
const wrapAsync              = require("../utils/wrapAsync")  // isse ek yeah fayda bhi hoga ki error aane par humara server crash nhi hoga bs message print goga
const {listingSchema,
    reviewSchema }           = require("../schemaforjoi.js")
    const Listing            = require("../models/listings")
    const ExpressError       = require("../utils/ExpressError")   // middle ware k ander humne expresserror use kr rhe hai taaki hum custom error send kar paaye saare pages k liye alag alag error
const {isLoggedIn ,isOwner}  = require("../views/middleware/middlewaree")
const multer                 = require("multer")   //it is help for funtioning for passing multipart data 
// example the image that we have just extracted from file from laptop multer will help to pass that image  
const {storage} = require("../cloudconfig.js") ;
const upload                 = multer({storage})  // humne multer ko bta diya ki jitni images vo pass krega vo saari uploads vale folder mein save ho jayega

const modeviewcontroller = require("../controllers/listing")

 //for creating route
 const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body) ;
    console.log(error) ;
    if(error) {
        let errmsg = error.details.map((el) => el.message ).join(",") ;
        throw new ExpressError(400,errmsg) ;
    }else {
        next() ; 
    }
}

router
.route("/")
// index
.get( wrapAsync( modeviewcontroller.index ))
// CREATE ROUTE
.post(
    isLoggedIn,upload.single('listing[image]') ,
     wrapAsync(modeviewcontroller.create )
)

// .post( upload.single('listing[image]') , (req,res) => {  //upload.single('listing[image]')  ab yeah vala  function humare upload vale folder k andar uploaded image daaldega
//     res.send(req.file) ;
// })

  //NEW ROUTE
  router.get("/new" ,isLoggedIn, (req,res) => {
    res.render("listings/new") ;
    res.send("radha") ;
} )

router
.route("/:id")
.get( wrapAsync( modeviewcontroller.show ))
.post(isLoggedIn,wrapAsync( modeviewcontroller.delete ))

 

    // //NEW ROUTE
    // router.get("/new" , (req,res) => {
    //     // res.render("./listings/new")
    //     res.send("radha")
    //     } )
    
    



//INDEX ROUTE
router.get("/?" , wrapAsync( modeviewcontroller.new ))
    
    //SHOW ROUTE
    router.get("/:id" , wrapAsync( modeviewcontroller.show ))

    //Update route
    router.put("/:id" ,
        isLoggedIn,
         upload.single("listing[image]") ,
         
        
          wrapAsync(async ( req,res  ) => {  // next bhi aayega isme try&catch method k liye 
        let {id} = req.params ; //params = parameter

        // let Listing =await Listing.findById(id) ; 
        // if(!Listing.owner.equals(res.locals.curruser._id)){
        //    req.flash("error" , "You dont have permiddion to edit" )
        //    return res.redirect(`/listings/${id}`)
        // }

    if(!req.body.listing) {
        throw new ExpressError(400 , "Send valid data for LISTING" )
    }

    // let {id} = req.params ; //params = parameter 
    // let Listing =await Listing.findById(id) ; 

    // if(!Listing.owner.equals(res.locals.curruser._id)){
    //    req.flash("error" , "You dont have permiddion to edit" )
    //    return res.redirect(`/listings/${id}`)
    // }

    let listing =  await Listing.findByIdAndUpdate(id , {...req.body.listing} ) ;

    if(typeof req.file !== "undefined" ){
        let url = req.file.path ;
        let filename = req.file.filename ;
        listing.image = {url,filename};
        await listing.save() ;
        }

    req.flash("Success" , "U have updated route" ) ;
    res.redirect( `/listings/${id}` ) ;     
}    ))

//EDIT route
router.get("/:id/edit", isLoggedIn,wrapAsync(modeviewcontroller.edit) )

//DELETE route 
router.post("/:id" ,isLoggedIn,wrapAsync( modeviewcontroller.delete ))



 module.exports = router


















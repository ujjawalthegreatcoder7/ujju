if(process.env.NODE_ENV != "production" ) {
    require('dotenv').config() ; // yes bhai isko require krne ka style thoda casual hai  mazaak se hat k thoda alag hai             
    
}
console.log(process.env.secret)


const express             =  require("express") ;
const app                 =  express() ;
const mongoose            =  require("mongoose") ;
// const Listing          =  require("./models/listings")
const path                =  require("path") ;
const methodOverride      =  require("method-override") ; 
const ejsMate             =  require("ejs-mate") ;     // hum iski vajah se template bnayenge matlab boilerplate mein navbar bna kar hum usko saare pages par include kr sakte hai
// const wrapAsync        =  require("./utils/wrapAsync")  // isse ek yeah fayda bhi hoga ki error aane par humara server crash nhi hoga bs message print goga
                                                     //wrapAsync we have written try&catch method for create&iupdaate route there we can use wrapAsync method in this we will not write try &catch
const ExpressError        =  require("./utils/ExpressError")   // middle ware k ander humne expresserror use kr rhe hai taaki hum custom error send kar paaye saare pages k liye alag alag error
// const {listingSchema,
    //  reviewSchema }    =  require("./schemaforjoi.js")
// const Review           =  require("./models/review") 
const expresssession      = require("express-session")  // it is use to save data in chrome for example if we save something in amazon add to cart it is saved in it
const session             = require("express-session")  // it is use to save data in chrome for example if we save something in amazon add to cart it is saved in it
const MongoStore           = require('connect-mongo')   // it will help to create mongo store for storing items
const flash               = require("connect-flash")
const passport            = require("passport")
const LocalStrategy       = require('passport-local')
const User                = require("./models/user") 

const listingrouter       =  require("./routes/listing")
const userreviewrouter    =  require("./routes/reviewsriutes")
const userrouter          = require("./routes/user")
// const mongoosee = "mongodb://127.0.0.1:27017/wonderlustt" ;
const dburl = process.env.ATLASDB_URL

main()
.then(() => {
    console.log("Connected to .D.B.") ;
})
.catch((err) => {
    console.log(err) ;
})
async function main() {
    await mongoose.connect(dburl)
}

app.set("view engine" , "ejs" ) ;
app.set("views" , path.join(__dirname, "views") ) ;
app.use(express.urlencoded  ({extended : true}) ) ;  // req.params  k liye taaki hum apni ID ko extract kr paaye 
app.use(methodOverride("_method")) ;
app.engine('ejs', ejsMate ) ;
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create ({
mongoUrl : dburl ,
crypto :{
    secret :  process.env.SECRET ,
},
touchAfter : 24 * 3600 ,
})

store.on("error" , () => {
    console.log(" ERROR " , err );
} )

const sessionOptions = {
    store,
    secret            : process.env.SECRET ,
    resave            : false     ,
    saveUninitialized : true      ,
    cookie : {
        expires  : Date.now() + 7 * 24 * 60 * 60 * 1000 , //  yeah timings hai ki itne time tak vo web site par login rhega 
        maxAge   :  7 * 24 * 60 * 60 * 1000 , // itne millisecond bad expire ho jeayega sessionvvuhapar 
        // expiry date bhi autmatically likhi hui aayegi ki is date ko session expire ho jayega
        httpOnly : true ,
    } 
}



app.use(expresssession(sessionOptions)) ;
app.use(flash())

app.use(passport.initialize()) ;  // 
app.use(passport.session())  // it help to check is the request going from one page to another the user is same or not if user is not n=same then it will automaticaally logout 
passport.use(new LocalStrategy(User.authenticate())) // authenticate is a method that will help user for login 
passport.serializeUser(User.serializeUser()) ; // if user will login then we will serialize user information store
passport.deserializeUser(User.deserializeUser()) ; // if user will logout then it will be deseriaize matlab user ka session khatm hogya 

app.use((req,res,next) => { 
    res.locals.success  = req.flash("Success")
    res.locals.error    = req.flash("error")
    res.locals.curruser =  req.user 
next() ;
})

app.get("/demouser" ,async (req,res) => {
    let fakeUser = new User({
        email : "ujjuarora5@gmail.com" ,
        username  : "RADHAKRISH"
    });

 let registeredUser = await User.register( fakeUser , "helloRADHAkrish" )  // in this we pass user & password
 res.send(registeredUser)
} ) ;



// //for creating route  
// const validatereview = (req,res,next) => {   // it is joi for reviews
//     let {error} = reviewSchema.validate(req.body) ;
//     console.log(error) ;
//     if(error) {
//         let errmsg = error.details.map((el) => el.message ).join(",") ;
//         throw new ExpressError(400,errmsg) ;
//     }
//     else {
//         next() ;
//     }
// }

app.use("/listings" , listingrouter )
app.use("/listings/:id/reviews" , userreviewrouter )
app.use("/" , userrouter ) ;



// // REVIEWS
// //POST ROUTE 
// app.post("/listings/:id/reviews",
//     validatereview ,
//      wrapAsync( async (req,res) => {
//         let listing = await Listing.findById(req.params.id)
//         let newReview = new Review(req.body.review) // example name = review[price]   jo maine input mein likha hai
//         listing.reviews.push(newReview) ;
//         newReview.save() ;
//         await listing.save() ;
//         console.log("new review saved")
//         console.log(newReview)
//         res.redirect(`/listings/${listing._id}`)
// } ) )

// //RWEVIEW DELETE  
// app.delete("/listings/:id/reviews/:reviewId" ,
//      wrapAsync(async (req,res) => {
//         let {id,reviewId} = req.params ;
//         await Review.findByIdAndDelete(reviewId) ;
//         res.redirect(`/listings/${id}`)
// } ))


app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page not found RADHA ji aapka bhla kre" ))   // 404 = statusCode & Page not found RADHA ji aapka bhla kre = message
} )

app.use((err,req,res,next)  => {   // it is middleware used i have used it for edit page(update) & new (create) 

    let {statusCode = 500 ,message = "radha ji bhla kre " } = err ;
    res.render("error.ejs" , {message , err } ) ;


    // res.status(statusCode).send(message)  // middle ware k ander humne expresserror use kr rhe hai taaki hum custom error send kar paaye saare pages k liye alag alag error

})

//wrapAsync we have written try&catch method for create&iupdaate route there we can use wrapAsync method in this we will not write try &catch

app.listen(5000 , () => {
    console.log("Server is working") ; 
})































































//INDEX ROUTE
// app.get("/listings" , wrapAsync(async(req,res) => {    
//      const allListings = await Listing.find({})
//         // res.send(" RADHA k krishna ")
//         res.render("./listings/index.ejs" , {allListings} )
//     } ))

//     //NEW ROUTE
// app.get("/listings/new" , (req,res) => {
//     res.render("./listings/new")
//     } )

// app.get("/testlisting" , wrapAsync( async (req,res) => {

    //     let sapleListing = new Listing ({
    
    //      title : "RADHA k KRISHNA" ,
    //      description : "RADHA ji bhla kre RADHA ji ang sang rhe" ,
    //      price : 7 ,
    //      location : "BARSANA" ,
    //      country : "BHARAT" ,
    
    //     })
    //     await sapleListing.save() ;
    //     console.log(sapleListing)
    //     console.log("Sample was saved") ;
    //     res.send("Succesful RADHA ji bhla kre") ;
    // } ))
    



// //INDEX ROUTE
// app.get("/listings" , wrapAsync(async(req,res) => {    
//      const allListings = await Listing.find({})
//         // res.send(" RADHA k krishna ")
//         res.render("./listings/index.ejs" , {allListings} )
//     } ))

//     //NEW ROUTE
// app.get("/listings/new" , (req,res) => {
//     res.render("./listings/new")
//     } )

   
    
// //CREATE ROUTE
// app.post("/listings" ,
//      validateListing,
//       wrapAsync(async(req,res) => {    // isme humne wrapAsync method nhi lgaya hum lga sakte hai lekin maine nhi lgaya
//     // let listing = req.body.listing ;  // is k through hum input vali saara text mongoose mein daal sakte hai
   

//     // if(!req.body.listing) {
//     //     throw new ExpressError(400 , "Send valid data for LISTING" )
//     // }
//     const newListing = new Listing(req.body.listing) ;
//     // if(!newListing.description) {                      // ab hum if and else k lava hum joi use kar sakte hai   JOI
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }

//     // if(!newListing.title) {
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }

//     // if(!newListing.location) {
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }

//     // if(!newListing.country) {
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }

//     // if(!newListing.price) {
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }

//     // if(!newListing.image) {
//     //     throw new ExpressError(404 , "Send valid data for Description" )
//     // }
    
//     await newListing.save() ;
//     res.redirect("/listings") ;
// } )
// )
//     //SHOW ROUTE
//     app.get("/listings/:id" , wrapAsync(async ( req,res ) => {
//     let {id} = req.params ; //params = parameter 
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show" , {listing} ) ;
//     // res.send("radhaji")
// }    ))

//     //Update route
//     app.put("/listings/:id" ,validateListing , wrapAsync(async ( req,res  ) => {  // next bhi aayega isme try&catch method k liye 
//         // try{                                                          // we have used wrapAsync method instead of this try&catch
//         //     let {id} = req.params ; //params = parameter 
//         //     await Listing.findByIdAndUpdate(id , {...req.body.listing} ) ;
//         //     res.redirect( `/listings/${id}` ) ;     
//         // }catch(err) {
//         //     next(err)
//         // }

//         if(!req.body.listing) {
//             throw new ExpressError(400 , "Send valid data for LISTING" )
//         }

//         let {id} = req.params ; //params = parameter 
//         await Listing.findByIdAndUpdate(id , {...req.body.listing} ) ;
//         res.redirect( `/listings/${id}` ) ;     
//     }    ))

// //EDIT route
// app.get("/listings/:id/edit" ,wrapAsync(async (req,res) => {
//     let {id} = req.params ;
//     console.log("RADHAji") ;
//     const listing = await Listing.findById(id)
//     res.render("./listings/edit", {listing}  )
// } ) )

// //DELETE route 
// app.post("/listings/:id" ,wrapAsync(async (req,res) => {
//     let {id} = req.params ;
//     let deletedListing = await  Listing.findByIdAndDelete(id)
//     // res.send("radha ji")
//     console.log(deletedListing)
//     res.redirect( `/listings` ) ;   
// } ))


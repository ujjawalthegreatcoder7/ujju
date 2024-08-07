const express   =  require("express") 
const router    =  express.Router() ;
const User      =  require("../models/user")   
const passport  =  require("passport")
const {  saveRedirectUrl } = require("../views/middleware/middlewaree")




 router.get("/signup" , (req,res) => {
 res.render("./listings/signup")  
} )

    router.post("/signup" ,   async(req,res) => {
    try{
        let {username,email,password} = req.body ;
        const newUser        = new User({email,username}) ;
        const registeredUser = await User.register(newUser , password )
        console.log(registeredUser)
       
        req.login(registeredUser , (err) => {
            if(err) {
                return next(err) ;
            }
            req.flash("Success" , "U have Registered" )
            res.redirect("/listings")    
        } )

    }catch(e) {
        req.flash("error" , "This mail username have registered before" )
        res.redirect("/Signup")
    }
    } )

    router.get("/login" , async(req,res) => {
    res.render("./listings/login")
    } )

    router.post("/login" , 
        saveRedirectUrl ,
         passport.authenticate
        ("local" , {failureRedirect : '/login' , // yeah ek automatic function hai jisme agar humne galat username ya password daala toh vo redirect ho jayega "/login" page par 
            failureFlash : true  } )  ,         // 
            
            async (req,res) => {   // passport.authenticate ek middleware hai ya function maanlo yeah check krega ki name use kiya hai na

                let redirectUrl = res.locals.redirectUrl || "/listings" ;
                res.redirect(redirectUrl)
    } )


    router.get("/logout" , (req,res) => {
        // res.send("RADHAji")
        // res.render("./listings/logout")
        req.logout((err) => {   // logout() is a function of passport library that help for logout
           if(err) {
            next(err)
           } 
           req.flash("Success" , "You are logged out" ) ;
           res.redirect("/listings")
        } )  
    } )

module.exports = router ;




































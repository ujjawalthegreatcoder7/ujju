const express = require("express") ;                          
const app     = express() ; 
const forusersroutes = require("./routes/user")
const forpostsroutes = require("./routes/post")
const expresssession = require("express-session")
const flash = require("connect-flash")
const path = require("path")

app.set("view engine" , "ejs" ) ; 
app.set("views" , path.join(__dirname , "views" ) ) ;

 const sessionOptions =  {
        secret : "mysecretstringRADHAji" ,
         resave : false , 
         saveUninitialized : true } ;  // saveUninitialized it help store information even when it is not initialized
 // it will help to sav things in our website for example amazon par hum add to cart karte hai aur agr tab band ho jaye aur hum phir se tab khole 
 //toh saari cheeze add tocart vali saved rehti hai



 app.use(expresssession(sessionOptions))
app.use(flash())

app.use((req,res,next) => {
    res.locals.messages = req.flash("Success")
    res.locals.errmessages = req.flash("error")
next() ;
})

    app.get("/register" , (req,res) => {
        let { name = "RADHA ji" } = req.query ;
        req.session.name = name ;        
     
        if(name === "RADHA ji") {
            req.flash("error" , "User Registered an error occured" ) ;
        }else {
            req.flash("Success" , "User Registered succesfullly" ) ;
        }

        res.redirect("/hello") ;

    } )
    app.get("/hello" , (req,res) => {
        // res.send(`hello ,${req.session.name}`) ;
        res.render("page" , { name : req.session.name  } )
    } )



// app.get("/reqcount" , (req,res) => {
//     if( req.session.count ) {
//         req.session.count++ ;
//     }else { req.session.count = 1 ; }
//     res.send(` RADHA K KRISHNA  ${ req.session.count  } `) ;
// } )



// app.get("/test" , (req,res) =>  {
//     res.send("test succesful!") ;
// })




   app.listen(3000 , () => {
   console.log(" RADHA JI bhla kre listening on port 3000 ") ;
    } )

//basic route 
app.get("/" , (req,res) => {
    res.send(" RADHA k krishna  & i am root ")  ;
} )

app.use( "/users" , forusersroutes  )

// //  USERS ROUTES
// //INDEX users 
// app.get("/users" ,(req,res) => {
//     res.send(" RADHA ji it is used for index route ")
// } )

// // show Users 
// app.get("/users/:id" , (req,res) => {
//     res.send(" GET for show users RADHA ji bhla kre ") ;
// } )

// //POST users 
// app.post("/users" , (req,res) => {
//     res.send("post for show users RADHA ji bhla kre  ")
// } )

// // DELETE route
//     app.delete("/users" , (req,res) => {
//     res.send(" RADHA ji delete for users id ") 
// } ) 


app.use( "/posts" , forpostsroutes  )


// // POSTS ROUTES
// //INDEX posts
// app.get("/posts" ,(req,res) => {
//     res.send(" RADHA ji it is used for index route ")
// } )

// // show posts
// app.get("/posts/:id" , (req,res) => {
//     res.send(" GET for show posts RADHA ji bhla kre ") ;
// } )

// //POST posts 
// app.post("/posts" , (req,res) => {
//     res.send("post for show posts RADHA ji bhla kre  ")
// } )

// // DELETE route
//     app.delete("/posts" , (req,res) => {
//     res.send(" RADHA ji delete for posts id ") 
// } ) 





































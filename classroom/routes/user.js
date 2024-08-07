const express = require("express") ;
const router = express.Router() ;


//  USERS ROUTES
//INDEX users 
router.get("/" ,(req,res) => {
    res.send(" RADHA ji it is used for index route ")
} )

// show Users 
router.get("/:id" , (req,res) => {
    res.send(" GET for show users RADHA ji bhla kre ") ;
} )

//POST users 
router.post("/" , (req,res) => {
    res.send("post for show users RADHA ji bhla kre  ")
} )

// DELETE route
    router.delete("/" , (req,res) => {
    res.send(" RADHA ji delete for users id ") 
} ) 


module.exports = router



































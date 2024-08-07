const express = require("express") ;
const router = express.Router() ;



// POSTS ROUTEs
//INDEX posts
router.get("/" ,(req,res) => {
    res.send(" RADHA ji it is used for index route ")
} )

// show posts
router.get("/:id" , (req,res) => {
    res.send(" GET for show posts RADHA ji bhla kre ") ;
} )

//POST posts 
router.post("/" , (req,res) => {
    res.send("post for show posts RADHA ji bhla kre  ")
} )

// DELETE route
    router.delete("/" , (req,res) => {
    res.send(" RADHA ji delete for posts id ") 
} ) 

module.exports = router


























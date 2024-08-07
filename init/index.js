const mongoose = require("mongoose") ;
const initData =  require("../init/data.js") ;
const Listing = require("../models/listings")

main()
.then(() => {
    console.log("Connected to .D.B.") ;
})
.catch((err) => {
    console.log(err) ;
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlustt")
}

const initDB = async() => {
    await Listing.deleteMany({}) ;
     initData.data =  initData.data.map((obj) => ({ 
        ...obj ,
         owner: "66a24c87ec4d970235dbe668" }) )

    await Listing.insertMany(initData.data) ;
    console.log("radha ji bhla kre")
 }
initDB()


























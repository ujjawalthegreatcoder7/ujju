const mongoose              =  require("mongoose") ;
const passportLocalMongoose =  require("passport-local-mongoose") ;

// passport-local-mongoose yeah automaticall username k liye space add krdeta hai  

const userSchema = new mongoose.Schema({
     email : {
        type      :  String ,
        required  :  true   ,
     },// isme vo username apne aap addkrlega
})

userSchema.plugin(passportLocalMongoose) ;// passport-local-mongoose yeah salt bhi add krega password taki autr security bad jaaye  password ki

// passport-local-mongoose yeah kaafi saare functions bhi provide krta hai jaise
//1. authenticate 
// 2aur kaafi saare 

module.exports = mongoose.model('User' , userSchema ) ;





















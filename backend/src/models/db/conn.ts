import mongoose from  "mongoose";
mongoose.connect("mongodb://127.0.0.1/usersignup",{
})
.then(()=>{
    console.log("Connection Successfull")
})
.catch((err)=>{
    console.log("NO Connection");
})
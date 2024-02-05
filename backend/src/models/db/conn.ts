import mongoose from  "mongoose";
mongoose.connect("mongodb://127.0.0.1/hotel",{
})
.then(()=>{
    console.log("Connection Successfull")
})
.catch((err)=>{
    console.log("NO Connection");
})
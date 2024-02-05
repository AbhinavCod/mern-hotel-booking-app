import mongoose, { modelNames }  from "mongoose";
import { HotelType } from "../shared/type";
// export type HotelType = {
//     _id:string;
//     userid:string;
//     name:string;
//     city:string;
//     country:string;
//     description:string;
//     type:string;
//     adultCount:number;
//     childCount:number;
//     facilities:string[];
//     pricePerNight:number;
//     starRating:number;
//     imageUrls:string[];
//     lastUpadetd:Date;
    
// }

const hotelSchema = new mongoose.Schema<HotelType>({
    userid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    adultCount:{
        type:Number,
        required:true
    },
    childCount:{
        type:Number,
        required:true
    },
    facilities:[{
        type:String,
        required:true
    }],
    pricePerNight:{
        type:Number,
        required:true
    },
    starRating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    imageUrls:[{
        type:String,
        required:true
    }],
    lastUpdated:{
        type:Date,
        required:true
    }

});

const Hotel = mongoose.model<HotelType>("Hotel",hotelSchema);

export default Hotel;
import express, {Request,Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { buffer } from "stream/consumers";
import Hotel from "../models/hotels";
import { HotelType } from "../shared/type";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage:storage,
    limits:{
        fileSize:5 * 1024 * 1024 // 5MB
    }
})

// api/my-hotels
router.post("/",verifyToken,[
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("PricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),

],upload.array("imageFiles",6),async (req:Request,res:Response)=>{
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel:HotelType = req.body;
        
        //1. upload the images to cloundianry
        const imageUrls = await uploadImages(imageFiles);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userid = req.userId;

        //3. save the new hotel in our database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        //4. return a 201 status
        res.status(201).send(hotel); 

    } catch (error) {
        console.log("Error creating hotel: ",error);
        return res.status(500).json({message:"Something went wrong"});
    }
});


router.get("/",verifyToken, async (req:Request,res:Response)=>{
    
    try {
        const hotels = await Hotel.find({userid:req.userId});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({message:"Error fetching hotels"});
    }
});


router.get("/:id",verifyToken,async (req:Request,res:Response)=>{
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id:id,
            userid:req.userId,
        });

        res.json(hotel);
    } catch (error) {
        res.status(500).json({message:"Error fetching hotels"});
    }
})

router.put("/:hotelId",verifyToken, upload.array("imageFiles"),async (req:Request,res:Response)=>{
    try {
        const updatedHotel :HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({_id:req.params.hotelId,userid:req.userId},updatedHotel,{new:true});

        if(!hotel){
            return res.status(400).json({message:"Hotel not found"});
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);
        hotel.imageUrls = [...updatedImageUrls,...(updatedHotel.imageUrls || [])];
        await hotel.save();
        res.status(201).json(hotel);


    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
})


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    //2. If upload was successsfull, add the URLs to the new hotel
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
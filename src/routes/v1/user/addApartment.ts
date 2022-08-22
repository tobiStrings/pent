import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { isEmpty, isValidUsername } from "../../../helpers";
import isEmail from "validator/lib/isEmail";
import Apartment ,{ICreateApartmentPayload} from "../../../controllers/apartment/apartment.controllers";

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router:Router = Router();
router.use(apiLimiter);
router.post("/",async(req:Request,res:Response)=>{
    const {address,imgUrl,landlordId}:ICreateApartmentPayload = req.body;
    if(isEmpty(address,landlordId)){
        return res.status(400).json({
            status:"error",
            message:"make sure address and landlordId is "
        })
    }

    const apartmentController:any = new Apartment();
    try{
        const data:any = await apartmentController.createApartment({address,imgUrl,landlordId});
        return res.status(200).json({
            status:"sucessful",
            message:"apartment added",
            apartment:data
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            status: "error",
            message:e || "Something went wrong",

        })
    }
})
export default router;
import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { isEmpty, isValidUsername } from "../../../helpers";
import isEmail from "validator/lib/isEmail";
import User, {IPostReviewPayload} from "../../../controllers/user/user.controllers";

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router:Router = Router();
router.use(apiLimiter);

router.post("/",async(req:Request,res:Response)=>{
    const {vid,img,quality,landlordId,environment,apartmentId}:IPostReviewPayload = req.body;
    
    if(quality <=0 || quality>10){
        return res.status(400).json({
            status:"error",
            message:"please make sure quality is between 1 and 10",
            data:null
        })
    }

    if(environment <=0 || environment>10){
        return res.status(400).json({
            status:"error",
            message:"please make sure environment is between 1 and 10",
            data:null
        })
    }

    if(isEmpty(landlordId,apartmentId)){
        return res.status(400).json({
            status:"error",
            message:"landlordId and apartmentId should be provided!",
            data:null  
        })
    }

    const userController:any = new User();

    try{
        const data :any = await userController.postReview({vid,img,quality,landlordId,environment,apartmentId});
        if(data.status === "error"){
            return res.status(400).json({
                status:"error",
                message:data.message
            })
        }

        if(data.status === "sucessful"){
            return res.status(200).json({
                status:"sucessful",
                message:data.message,
                review:data.review,
                apartment:data.apartment,
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: "error",
            message:error || "Something went wrong",

        })
    }
})
export default router;
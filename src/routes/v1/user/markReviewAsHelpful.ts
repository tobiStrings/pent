import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { isEmpty, isValidUsername } from "../../../helpers";
import isEmail from "validator/lib/isEmail";
import User from "../../../controllers/user/user.controllers";

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router:Router = Router();
router.use(apiLimiter);

router.patch("/",async (req:Request, res:Response)=>{
    console.log("got here")
    const payload = req.body;
    const reviewId =  payload.reviewId;

    if(isEmpty(reviewId)){
        return res.status(400).json({
            status:"error",
            message:"review id cannot be blank"
        })
    }

    const userController:any = new User();

        try{
            const data :any = await userController.markReviewAsHelpful(reviewId);
            if(data.status === "error"){
                return res.status(400).json({
                    status:"error",
                    message:data.message
                })
            }
    
            if(data.status === "successful"){
                return res.status(200).json({
                    status:"sucessful",
                    message:data.message,
                    review:data.review,
                })
            }
            
        }catch(error){
            console.log(error);
            return res.status(500).json({
                status: "error",
                message:error || "Something went wrong",
    
            })
        }
});

export default router;
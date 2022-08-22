import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { isEmpty, isValidUsername } from "../../../helpers";
import isEmail from "validator/lib/isEmail";
import User, {IUserSignupPayload} from "../../../controllers/user/user.controllers";


const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router:Router = Router();
router.use(apiLimiter);

router.post("/", async(req:Request, res:Response)=>{
    const {email,password}:IUserSignupPayload = req.body;
   if(isEmpty(email,password)){
        return res.status(400).send({
            status: "error",
            message: "Please fill all the fields",
            data: null,
        })
   }

    if (password.length < 6) {
        return res.status(400).json({
            status: "error",
            message: "Password must be at least 6 characters",
            data: null,
        });
    }

    if(!isEmail(email)){
        return res.status(400).json({
            status: "error",
            message: "email is invalid",
            data: null,
        });
    }

    const userController:any = new User();
    try{
        const data: any = await userController.signin(
            {email,password}
            );
        if(data.status === "error"){
            return res.status(400).json({
                status: "error",
                message: data.message || "Something went wrong",
                data: null,
            });
        }

        if(data.status === "success"){
            return res.status(200).json({
                status: data.status,
                message: data.message || "Something went wrong",
                data: data.user,
                token:data.token
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
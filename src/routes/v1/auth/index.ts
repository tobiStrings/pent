import { Router } from "express";
import signup from "./signup";
import signin from "./signin";
const router:Router  = Router();

router.use("/signup", signup);
router.use("/signin",signin);

export default router
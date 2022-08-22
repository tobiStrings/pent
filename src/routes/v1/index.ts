import { Router } from "express";
import auth from "./auth/index";
import users from "./user/index"
const router: Router = Router();

// handles signup
router.use("/auth", auth);
router.use("/user",users)
export default router;
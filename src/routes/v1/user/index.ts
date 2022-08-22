import { Router } from "express";
import postReview from "./postReview";
import addApartmet from "./addApartment";
import markReviewAsHelpful from "./markReviewAsHelpful";
const router:Router  = Router();

router.use("/post-review",postReview);
router.use("/add-apartment",addApartmet);
router.use("/mark-as-helpful",markReviewAsHelpful);

export default router;
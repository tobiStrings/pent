import reviews, { Ireview } from "../../models/review.models";
import { Url } from "url";
import { v4 } from "uuid";
export interface ICreateReviewPayload{
    vidUrl:Url;
    img:Url;
    landlordId:string;
    environment:Number;
    quality:Number;
}
class Review{
    constructor(){};
    async saveReview({vidUrl,img,landlordId,environment,quality}:ICreateReviewPayload){
        return new Promise(async(resolve,reject)=>{
            try{
                const reviewId = v4();
                const newReview =   new reviews({
                    vidUrl,img,landlordId,environment,quality,reviewId
                })
                const savedReview = await newReview.save();
                return resolve({
                    status:"successful",
                    message:"review saved",
                    data:savedReview
                })
            }catch(e){
                return reject({
                    status:"error",
                    message:e || "something went wrong"
                })
            }
            
        })
    }

    async findReview(search:string):Promise<Ireview | undefined | null>{
        try {
            const review: Ireview | null | undefined = await reviews.findOne({
              $or: [
                {
                  reviewId: search,
                },
              ],
            });
            return review;
          } catch (err) {
            throw err;
          }
    }

    async updateReview(review:Ireview):Promise<Ireview | undefined | null>{
        try{
            const updatedReview = new reviews(review);
            const savedReview = await reviews.findByIdAndUpdate(updatedReview._id,review,
              { useFindAndModify: false });
            return savedReview;
        }catch(e){
            throw e;
        }
    }

    async findAll():Promise<Ireview[] | undefined|null>{
        try{
            const allReviews = await reviews.find();
            return allReviews;
        }catch(e){
            throw e;
        }
    }
}

export default Review;

import { Schema, model, Document } from "mongoose";
import { Url } from "url";

export interface Ireview extends Document{
    reviewId:string;
    vidUrl:Url;
    img:Url;
    landlordId:string;
    environment:Number;
    quality:Number;
    helpful:boolean[]
    createdOn:Date
}

const reviewSchema = new Schema<Ireview>({
    reviewId:{
        type: String,
        required: true,
    },
    vidUrl:{
        type: String,
        required: false,
    },
    img:{
        type: String,
        required: false,
    },
    landlordId:{
        type: String,
        required: true,
    },
    environment:{
        type: Number,
        required: true,
        max:10,
    },
    quality:{
        type: Number,
        required: true,
        max:10,
    },
    helpful:{
        type:[],
        required:false,
    },
    createdOn:{
        type:Date,
        required:true,
        default:Date.now(),
    }
})

export default model<Ireview>("reviews", reviewSchema);
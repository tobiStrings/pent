import { Schema, model, Document } from "mongoose";
import { Url } from "url";

export interface Ireview extends Document{
    reviewId:string;
    text: string;
    vidUrl:Url;
    img:Url;
    landlord:string;
    environment:string;
    quality:Number;
    helpful:boolean
}

const reviewSchema = new Schema<Ireview>({
    reviewId:{
        type: String,
        required: true,
    },
    text:{
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
    landlord:{
        type: String,
        required: true,
    },
    environment:{
        type: String,
        required: true,
    },
    quality:{
        type: Number,
        required: true,
    },
    helpful:{
        type:Boolean,
        required:true,
    }
})

export default model<Ireview>("reviews", reviewSchema);
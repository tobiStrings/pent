import { Schema, model, Document } from "mongoose";
import { Url } from "url";
import { Ireview } from './review.models';

export interface Iapartment extends Document{
    apartmentId: string;
    address:string;
    img:Url
    landlordId:string
    reviews:Ireview[]
    createdOn:Date;
}

const apartmentSchema = new Schema<Iapartment>({
    apartmentId:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    img:{
        type: String,
        required: false,
    },
    landlordId:{
        type: String,
        required: true,
    },
    reviews:{
        type:[],
        required:true
    },
    createdOn:{
        type:Date,
        required:true,
        default:Date.now(),
    }
})
export default model<Iapartment>("apartments", apartmentSchema);
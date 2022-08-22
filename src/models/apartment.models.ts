import { Schema, model, Document } from "mongoose";
import { Url } from "url";

export interface Iapartment extends Document{
    apartmentId: string;
    address:string;
    img:Url
    landlord:string
    reviews:[]
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
    landlord:{
        type: String,
        required: true,
    },
    reviews:{
        type:[],
        required:true
    }
})
export default model<Iapartment>("apartments", apartmentSchema);
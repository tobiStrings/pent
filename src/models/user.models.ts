import { Schema, model, Document } from "mongoose";

export interface Iuser extends Document{
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber:string;
    createdOn: Date;
    userRole:string;
}
export enum userRoles {
    VISITOR = "visitor",
    LANDLORD = "landlord",
}

const userSchema = new Schema<Iuser>({
    userId: {
        type: String,
        required: true,
      },
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password:{
        type:String,
        required:true,
        unique:true
      },
      phoneNumber:{
        type:String,
        required:true,
        unique:true
      },
      userRole:{
        type:String,
        enum:userRoles,
        default:userRoles.VISITOR
      }
})

export default model<Iuser>("users", userSchema);
import isEmail from "validator/lib/isEmail";
import {
    comparePasswords,
    getCurrentDateInSeconds,
    hashString,
    isEmpty,
    minutesToSeconds,
    secondsToDate,
  } from "../../helpers/index";
import { v4 } from "uuid";
import users, { Iuser,userRoles } from "../../models/user.models";
import { Request } from "express";
import jwt from "jsonwebtoken";
import signJWT from "../../middleware/signJwt";
import bycrypt from "bcryptjs";
import { resolve } from "path";
import { Url } from "url";
import Apartment from "../apartment/apartment.controllers";
import Review from "../review/review.controllers";
import { Ireview } from "../../models/review.models";
const jwtSecret: string = process.env.JWT_SECRET || "123456";
const tokenExpirationInSeconds = 36000;

export interface IUserSignupPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber:string;
    userRole:string;
}

export interface IUserSigninPayload{
    email: string;
    password: string;
}
export interface IPostReviewPayload{
    vid:Url;
    img:Url;
    quality:Number;
    landlordId:string;
    environment:Number;
    apartmentId:string;
}
class User{
    constructor(){}
    async signup({firstname,lastname,email,password,phoneNumber,userRole}:IUserSignupPayload){
        return new Promise(async(resolve,reject)=>{
            let user: Iuser | null | undefined;
            try{
                checkIfPayloadIsValid(firstname,lastname,email,password,phoneNumber,userRole)
                checkIfEmialIsValid(email);
                user =  await this.findUser(email);
                checkIfUserEmailExist(user);
                user =  await this.findUser(phoneNumber);
                checkIfPhonenumberExist(user);
                if(userRole === "visitor" || userRole === "VISITOR"){
                    userRole = userRoles.VISITOR;
                }else if (userRole === "landlord" || userRole === "LANDLORD"){
                    userRole = userRoles.LANDLORD;
                }else{
                    return reject({
                        status:"error",
                        message:"user was not created"
                    })
                }
                const hashedPassword:string = hashString(password);
                const userId = v4();
                const newUser = new users({
                    firstname,
                    lastname,
                    email,
                    password:hashedPassword,
                    phoneNumber,
                    userId,
                    userRole
                })

                const savedUser = await newUser.save();
                return resolve({
                    status:"success",
                    message:"user was created successfully",
                    data:savedUser
                });

            }catch(_error){
                let error:Error|any= _error
                console.log(error.message);
                return reject({
                    status:"error",
                    message:error.message || "something went wrong",
                })
            }
            
        })
    }

    async signin({email,password}:IUserSigninPayload){
        return new Promise(async (resolve,reject)=>{
            const user:Iuser | any = await this.findUser(email);
            if(!user){
                return reject({
                  status:"error",
                  message:"user not found"
                })
            }        
            
            if(!bycrypt.compare(password, user.password)){
                return reject({
                  status:"error",
                  message:"password is invalid"
                })
            }

            signJWT(user,(error,token) =>{
                if(error){
                  console.log(error.message);
                    return  reject({
                      status:"error",
                      message:error.message || "something went wrong",
                    });
                }else if(token){
                  return resolve({
                    status:"success",
                    message:"login was successful",
                    user:user,
                    token:token
                  })
                }
              });
        })
    }

    async postReview({vid,img,quality,landlordId,environment,apartmentId}:IPostReviewPayload){
        return new Promise(async (resolve,reject)=>{
            try{
                const landLord:any =  await this.findUser(landlordId);
                if(!landLord){
                    return reject({
                        status:"error",
                        message:"landord not found"
                    })
                }
                const apartmentController : any =  new Apartment();
                const apartment:any = await apartmentController.findApartment(apartmentId);
    
                if(!apartment){
                    return reject({
                        status:"error",
                        message:"apartment not found"
                    })
                }
    
                const reviewController:any =  new Review();
                const savedReview:any =  await reviewController.saveReview({
                    vid,img,landlordId,environment,quality
                });
                console.log(savedReview);
                apartment.reviews.push(savedReview.data);
                const updatedApartment =  await apartmentController.updateApartment(apartment);
                return resolve({
                    status:"sucessful",
                    message:"review created sucessfully",
                    review:savedReview,
                    apartment:updatedApartment
                })

            }catch(e){
                console.log(e);
                return reject({
                    status:"error",
                    message:e
                })
            }
        })

    }

    async markReviewAsHelpful(reviewId:string){
        return new Promise(async (resolve,reject)=>{
            try{
                const reviewController:any =  new Review();
            const review:any = await reviewController.findReview(reviewId);
            if(!review){
                return reject({
                    status:"error",
                    message:"review id is invalid"
                })
            }

            review.helpful.push(true);
            const updatedReview:Ireview =  await reviewController.updateReview(review);
            return resolve({
                status:"successful",
                message:"review marked as helpful",
                review:updatedReview
            })
            }catch(e){
                return reject({
                    status:"error",
                    error:e
                })
            }
        })
    }

    async sortReviewsBasedOnMostHelpful(){
        return new Promise(async (resolve,reject)=>{
            try{
                const reviewController:any =  new Review();
                const allReviews:Ireview[] = reviewController.findAll();
                var i:any;
                
                for(i in allReviews){
                    
                }
            }catch(e){
                return reject({
                    status:"error",
                    error:e
                }) 
            }
        })
    }

    async findUser(search: string): Promise<Iuser | undefined | null> {
        try {
          const user: Iuser | null | undefined = await users.findOne({
            $or: [
              {
                email: search,
              },
              {
                phoneNumber: search,
              },
              {
                userId: search,
              },
            ],
          });
          return user;
        } catch (err) {
          throw err;
        }
      }
}
export default User

function checkIfPayloadIsValid(firstname:string, lastname:string, 
    email:string, password:string,phoneNumber:string,userRole:string){
    if(isEmpty(firstname,lastname,email,userRole,password,phoneNumber)){
       throw new Error("Fill in all details!");
    }
}

function checkIfEmialIsValid(email:string){
    if(!isEmail(email)){
        throw new Error("Emial is not valid");
    }
}


function checkIfUserEmailExist(user:User|any){
    if(user){
        throw new Error("email already exists");
    }
}
function checkIfPhonenumberExist(user:User|any){
    if(user){
        throw new Error("phonenumber already exists");
    }
}
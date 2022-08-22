import apartments, { Iapartment } from "../../models/apartment.models";
import { v4 } from "uuid";
export interface ICreateApartmentPayload{
  address:string;
  imgUrl:string;
  landlordId:string;
}

class Apartment{
    constructor(){}

    async findApartment(search: string): Promise<Iapartment | undefined | null> {
        try {
          const user: Iapartment | null | undefined = await apartments.findOne({
            $or: [
              {
                landlord: search,
              },
              {
                address: search,
              },
              {
                apartmentId: search,
              },
            ],
          });
          return user;
        } catch (err) {
          throw err;
        }
    }

    async updateApartment(apartment:Iapartment):Promise<Iapartment | undefined | null>{
        try{
            const updatedApartment = new apartments(apartment);
            const savedApartmet = apartments.findByIdAndUpdate(updatedApartment._id,apartment,
              { useFindAndModify: false });
            return savedApartmet;
        }catch(e){
            throw e;
        }
    }

    async createApartment({address,imgUrl,landlordId}:ICreateApartmentPayload):Promise<Iapartment | undefined | null>{
      try{
            const apartmentId =  v4();
            const newApartment = new apartments({
              address,imgUrl,landlordId,apartmentId
            })
            const savedApartment = await newApartment.save();
            return savedApartment;
      }catch(e){
        throw e;
      }
    }
}

export default Apartment;
import { connect, ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

class Mongoose {
  constructor() {}
  connect() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    return new Promise((resolve, reject): void => {
      connect(process.env.MONGO_URI as string, options as ConnectOptions)
        .then((e: any) => {
            console.log("Conected to the db!");
          return resolve("Connected to MongoDB");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Mongoose;

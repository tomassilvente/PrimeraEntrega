import mongoose from "mongoose";
import CONFIG from "../../../config/config.js"

export class MongoManager{
    static #instance
    constructor(){
        mongoose.connect(CONFIG.MONGO_URL)
        .then(()=>{
        console.log("BD Conectado")
        })
        .catch((error)=>{
            console.log("Error Conect BD")
        })
    }

    static start(){
        if(!this.#instance){
            this.#instance =new MongoManager();
        }
        return this.#instance
    }
}
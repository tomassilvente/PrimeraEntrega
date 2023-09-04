import mongoose from "mongoose";
import cartController from "../../controllers/cart.controller.js";

const userCollection = 'Users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password:{
        type:String,
        require: true},
    cart: {
        type:[{type: mongoose.SchemaTypes.ObjectId}],
    },
    role:{
        type:String,
        enum:["client","admin"],
        default:"client"
    }
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel
import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartschema = mongoose.Schema({

    products:{
        type: Array,
        default: []
    }
    
})

const cartsModel = mongoose.model(cartsCollection, cartschema)
export default cartsModel
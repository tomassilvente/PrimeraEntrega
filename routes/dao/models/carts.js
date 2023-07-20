import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const cartsCollection = 'carts'

const cartschema = mongoose.Schema({

    products:{
        type: Array,
        default: []
    }
    
})

cartschema.plugin(mongoosePaginate)  

const cartsModel = mongoose.model(cartsCollection, cartschema)
export default cartsModel
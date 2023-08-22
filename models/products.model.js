import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const productsCollection = 'products'

const productchema = mongoose.Schema({

    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    code:{
        type:String,
        required: true,
        unique: true
    },
    status:{
        type:Boolean,
        default:true
    },
    stock:{
        type:Number,
        required: true
    },
    category:{
        type:String,
        required: true,
    },
    thumbnail:{
        type:Array,
        default: []
    }
})

productchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productchema)
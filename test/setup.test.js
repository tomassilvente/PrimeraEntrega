import mongoose from 'mongoose'
import { getDAOS } from "../../../../src/models/daos/indexDAO.js"
import userModel from '../src/models/schemas/Users.schema.js'

const {Products} = getDAOS()
const {Carts} = getDAOS()

before(async ()=>{
   await mongoose.connect('mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/testingDatabase/?retryWrites=true&w=majority')
})

after(async () =>{
    mongoose.connection.close()
})

export const dropProducts = async() =>{
    await Products.collection.drop()
}

export const dropCarts = async() =>{
    await Carts.collection.drop()
}

export const dropSessions = async() =>{
    await userModel.collection.drop()
}
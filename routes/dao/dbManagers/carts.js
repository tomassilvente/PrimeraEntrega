import cartsModel from "../models/carts.js";
import { productsModel } from "../models/products.js";

export default class Carts{
    constructor(){
        console.log("Carritos trabajando con Mongo")
    }

    getAll = async() =>{
        let carts = await cartsModel.find().lean()
        return carts
    }

    getById = async id=>{
        let cart = await cartsModel.findById(id)
        return cart
    }

    saveCarts = async cart=>{
        let result = await cartsModel.create(cart)
        return result
    }
    
    saveProduct = async (pid, cid) =>{
        const product = await productsModel.findById(pid)
        const prodExist = await cartsModel.find(prod => prod.code === product.code )
        if(!prodExist){
            const create = {$push: {products:{code: product.code, quantity: 1}}}
            await cartsModel.findByIdAndUpdate({_id: cid}, create)
            
            const result = await cartsModel.findById(cid)
            return result
        }
        else{
            await cartsModel.findByIdAndUpdate({_id: cid},{$inc:{"products.$[elem].quantity":1}},{arrayFilters:[{"elem.code":product.code}]})
            const result = await cartsModel.findById(cid)
            return result
        }
    }
}
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
        const cart = await cartsModel.findById(cid)
        let exist = cart.products.findIndex((p) => p._id.toString() === pid)
        if(exist === -1){
            const create = {$push: {products:{_id: product._id, quantity: 1}}}
            await cartsModel.findByIdAndUpdate({_id: cid}, create)
            
            const result = await cartsModel.findById(cid)
            return result
        }
        else{
            await cartsModel.findByIdAndUpdate({_id: cid},{$inc:{"products.$[elem].quantity":1}},{arrayFilters:[{"elem._id":product._id}]})
            const result = await cartsModel.findById(cid)
            return result
        }
    }
    deleteProduct = async(cid,pid) =>{
        const product = await productsModel.findById(pid)
        const cart = await cartsModel.findById(cid)
        let item = cart.products.find(prod => prod.code === product.code)
        if(item){
            cart.products.pull(item)
            await cart.save()
            return await cartsModel.findById(cid)
        }
        else{
            console.log("No se encontro")
        }
    }
    updateCart = async(cid, newCart)=>{
        const cart = await cartsModel.findById(cid)
        if(cart){
            await cartsModel.updateOne({_id:cid}, newCart)
        }
        else console.log("No se encontro el carro")
        return await cartsModel.find()
    }
    updateProdCart = async(cid, pid, quant) =>{
        const prod = await productsModel.findById(pid)
        await cartsModel.findByIdAndUpdate({_id: cid},{$inc:{"products.$[elem].quantity":quant}},{arrayFilters:[{"elem.code":prod.code}]})
        return await cartsModel.findById(cid)
    }
    deleteAll = async(cid) =>{
        const cart = await cartsModel.findById(cid)
        let products = cart.products
        while(products.length>0) cart.products.pull(products[0])
        cart.save()
        return await cartsModel.findById(cid)
    }
}
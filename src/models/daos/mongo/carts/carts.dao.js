import MailingService from "../../../../services/mailing.js";
import { HTTP_STATUS, HttpError } from "../../../../utils/resourses.js";
import { MongoManager } from "../../../db/mongo/mongo.manager.js";
import cartsModel from "../../../schemas/carts.schema.js"
import { productsModel } from "../../../schemas/products.schema.js";
import ticketModel from "../../../schemas/tickets.schema.js";

class Carts{
    constructor(){
        MongoManager.start()
    }

    getAll = async(id) =>{
        let query = id ? {_id: id} : {}
        let carts = await cartsModel.find(query).populate('products._id')
        return carts.map(carts => carts.toObject())
    }

    getById = async id=>{
        let cart = await cartsModel.findById(id)
        return cart
    }

    saveCarts = async (cart=[])=>{
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
        let exist = cart.products.findIndex((p) => p._id.toString() === pid)
        if(exist !== -1){
            if(cart.products[exist].quantity > 1) {
                await cartsModel.findByIdAndUpdate({_id: cid},{$inc:{"products.$[elem].quantity":-1}},{arrayFilters:[{"elem._id":product._id}]})
                const result = await cartsModel.findById(cid)
                return result
            }
            else {
                cart.products.pull(cart.products[exist])
                cart.save()
                const result = await cartsModel.findById(cid)
                return result
            }
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
    purchaseCart = async(cid,user) =>{
        const cart = await cartsModel.findById(cid)
        let notBuy = []
        let total = 0
        if(cart){
            for(let i = 0; i<cart.products.length; i++){
                let prod = await productsModel.findById(cart.products[i]._id)
                console.log(cart.products[i].quantity)
                console.log(prod.stock)
                if(prod.stock > cart.products[i].quantity){
                    const mailer = new MailingService()
                    let result = await mailer.sendSimpleMail({
                        from: 'tomassilvente3@gmail.com',
                        to: req.session.user.email,
                        subject: 'Compra exitosa!',
                        html:`<div>  
                                <h1>Los siguientes productos fueron comprados exitosamente:</h1>
                                <p> ${cart.products} </p>
                            </div>`})
                    await productsModel.findByIdAndUpdate({_id:cart.products[i]._id},{$inc:{"stock": - (cart.products[i].quantity)}})
                    total += prod.price * cart.products[i].quantity
                }
                else notBuy.push(prod._id)
            }
        }
        else return new HttpError("Cart not found", HTTP_STATUS.BAD_REQUEST)
        while(cart.products.length>0) cart.products.pull(cart.products[0])
        cart.save()
        let ticket = {
            purchase_datetime: Date(),
            purchaser: user,
            amount:total
        }
        ticketModel.create(ticket)
        if(notBuy.length > 0) ticket.push(`Couldn't buy ${notBuy} because of no stock`)
        return ticket
    }
    updateProdCart = async(cid, pid, quant) =>{
        const prod = await productsModel.findById(pid)
        await cartsModel.findByIdAndUpdate({_id: cid},{$inc:{"products.$[elem].quantity":quant}},{arrayFilters:[{"elem.code":prod.code}]})
        return await cartsModel.findById(cid)
    }
    deleteAll = async(cid) =>{
        const cart = await cartsModel.findById(cid)
        let products = cart.products
        while(products.length>0) cart.products.pull(cart.products[0])
        cart.save()
        return await cartsModel.findById(cid)
    }
}

export default new Carts()
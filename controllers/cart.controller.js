import Carts from "../services/carts.service.js"
import Products from "../services/products.service.js"
import {HTTP_STATUS, successResponse} from '../utils/resourses.js'

class cartController{
     async createCart (req,res,next){
        try {
            let products = req.body
            for(let i = 0; i< products.length ; i++)
                if(! await Products.getById(products[i].id)) res.status(400).send({status:"Error", error:"Producto no Encontrado en productos.JSON"})
            const result =  await Carts.saveCarts(products)
            const response = successResponse(result);
            res.status(HTTP_STATUS.CREATED).json(response)  
        }
    catch(error){
        req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }
    
     async getCart (req, res){
        try{
            let cartDB = await Carts.getById(Number(req.params.cid))
            if(cartDB) {
                const response = successResponse(cartDB);
                res.status(HTTP_STATUS.OK).json(response)  
            }  
            else res.status(HTTP_STATUS.NOT_FOUND)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async getCarts (req, res){
        try{
            let cartsDB = await Carts.getAll()
            if (cartsDB) {
                const response = successResponse(cartsDB);
                res.status(HTTP_STATUS.OK).json(response)  
            }
            else res.status(HTTP_STATUS.NOT_FOUND)    
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async postProducts (req,res){
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            let product = await Carts.getById(pid)
            if(product.length>1) res.status(400).send({status:"Error", error:"Solo se puede ingresar de a un producto en este metodo"})
            if(!product || !cid || !pid) res.status(400).send({status:"Error", error:"Producto o carrito no ingresado"})
            else{ 
                const result = await Carts.saveProduct(pid,cid)
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response)   
            }
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

    async cartPurchase (req, res){
        try{
            let cid = req.params.cid
            let user = req.user
            let result = await Carts.purchaseCart(cid, user)
            const response = successResponse(result);
            return res.status(HTTP_STATUS.OK).json(response)  
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async deleteProducts (req,res){
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            let prod = await Products.getById(pid)
            if(prod){
                let result = await Carts.deleteProduct(cid,pid)
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response)  
            }
            else res.status(HTTP_STATUS.NOT_FOUND)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async updateCart (req,res){
        try{
            let cid = req.params.cid
            let cart = req.body
            if(cart._id)
                res.status(HTTP_STATUS.BAD_REQUEST)            
            else {
            result = await Carts.updateCart(cid, cart)
            const response = successResponse(result);
            res.status(HTTP_STATUS.OK).json(response)        
            }
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async updateProducts (req,res){
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            let quant = req.body
            let prod = await Products.getById(pid)
            if(quant.quantity > 0 && prod){
                quant = quant.quantity
                let result = await Carts.updateProdCart(cid,pid,quant)
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response)             
            } 
            else res.status(HTTP_STATUS.BAD_REQUEST)  
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

     async deleteCart (req,res){
        try{
            let cid = req.params.cid
            let cart = await Carts.getById(cid)
            if(cart){
                let result = await Carts.deleteAll(cid)
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response)
            }
            else res.status(HTTP_STATUS.NOT_FOUND)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }
}
export default new cartController()
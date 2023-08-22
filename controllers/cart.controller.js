import Carts from "../services/carts.service.js"
import Products from "../services/products.service.js"

class cartController{
    async createCart (req,res){
        let products = req.body
        for(let i = 0; i< products.length ; i++)
            if(! await Products.getById(products[i].id)) res.status(400).send({status:"Error", error:"Producto no Encontrado en productos.JSON"})
        // await cartManager.addProducts(products)
        const result =  await Carts.saveCarts()
        res.send({status:"OK", message:"Creado exitosamente",payload:result})  
    }
    
    async getCart (req, res){
        //let cart = await cartManager.getCartById(Number(req.params.cid))
        let cartDB = await Carts.getById(Number(req.params.cid))
        if(cartDB) res.send({cartDB})
        else res.status(400).send({status:"Error", error:"No se encontró el producto."})
    }

    async getCarts (req, res){
        //let cartsFS = await cartManager.getCarts()
        let cartsDB = await Carts.getAll()
        if (cartsDB) res.send({status:'Success', payload:cartsDB})
        else res.status(400).send({status:"Error", error:"No se encontraron Carritos"})
    }

    async postProducts (req,res){
        let cid = req.params.cid
        let pid = req.params.pid
        let product = await Carts.getById(pid)
        if(product.length>1) res.status(400).send({status:"Error", error:"Solo se puede ingresar de a un producto en este metodo"})
        if(!product || !cid || !pid) res.status(400).send({status:"Error", error:"Producto o carrito no ingresado"})
        else{ 
            const result = await Carts.saveProduct(pid,cid)
            res.send({status:"OK", message:"Producto Agregado Correctamente", payload:result})
        }
    }

    async deleteProducts (req,res){
        let cid = req.params.cid
        let pid = req.params.pid
        let prod = await Products.getById(pid)
        if(prod){
            await Carts.deleteProduct(cid,pid)
            res.send({status:"OK", message:"Productos completamente eliminados"})
        }
        else res.status(400).send({status:"Error", error:"No se encontró el producto"})
    }

    async updateCart (req,res){
        let cid = req.params.cid
        let cart = req.body
        if(cart._id){
            res.status(400).send({status:"Error", error:"No se puede modificar ID"})
        }
        else await Carts.updateCart(cid, cart)
        res.send({status:"OK", message:"Productos modificados"})
    }

    async updateProducts (req,res){
        let cid = req.params.cid
        let pid = req.params.pid
        let quant = req.body
        let prod = await Products.getById(pid)
        if(quant.quantity > 0 && prod){
            quant = quant.quantity
            await Carts.updateProdCart(cid,pid,quant)
            res.send({status:"OK", message:"Productos modificados"})
        } 
        else res.status(400).send({status:"Error", error:"Ups! Algo salió mal"})
    }

    async deleteCart (req,res){
        let cid = req.params.cid
        let cart = await Carts.getById(cid)
        if(cart){
            await Carts.deleteAll(cid)
            res.send({status:"OK", message:"Todos los productos han sido completamente eliminados"})
        }
        else res.status(400).send({status:"Error", error:"No se encuentra el Carrito"})
    }
}
export default new cartController()
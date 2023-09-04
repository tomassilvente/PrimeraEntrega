import { Router } from "express";
import { uploader } from "../utils.js";
import cartController from "../controllers/cart.controller.js";

class cartRouter{
    constructor(){
        this.InicioCart = Router()
        this.InicioCart.get('/', cartController.getCarts)
        this.InicioCart.get('/:cid', cartController.getCart)
        this.InicioCart.post('/', cartController.createCart)
        this.InicioCart.post('/:cid/products/:pid', uploader.single('file'), cartController.postProducts)
        this.InicioCart.put('/:cid', cartController.updateCart)
        this.InicioCart.put('/:cid/products/:pid', cartController.updateProducts)
        this.InicioCart.put('/:cid/purchase', cartController.cartPurchase)
        this.InicioCart.delete('/:cid', cartController.deleteCart)
        this.InicioCart.delete('/:cid/products/:pid', cartController.deleteProducts)
    }
    getRouter(){
        return this.InicioCart
    }
}

export default new cartRouter()
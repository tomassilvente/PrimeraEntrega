import { Router } from "express";
import {isAdmin, isPremium, uploader} from '../utils.js'
import productController from "../controllers/product.controller.js";


class productRouter{
    constructor(){
        this.InicioProduct = Router()
        this.InicioProduct.get('/mockingProducts', productController.mockingProducts)
        this.InicioProduct.get('/', productController.getProducts)
        this.InicioProduct.get('/:pid', productController.getProduct)
        this.InicioProduct.post('/',uploader.single('file'), isAdmin || isPremium, productController.createProduct)
        this.InicioProduct.put('/:pid',uploader.single('file'),  isAdmin || isPremium , productController.updateProduct)
        this.InicioProduct.delete('/:pid',uploader.single('file'), isAdmin || isPremium, productController.deleteProduct)
    }
    getRouter(){
        return this.InicioProduct
    }
}
export default new productRouter()
import { Router } from "express";
import {uploader} from '../utils.js'
import productController from "../controllers/product.controller.js";

class productRouter{
    constructor(){
        this.InicioProduct = Router()
        this.InicioProduct.get('/', productController.getProducts)
        this.InicioProduct.get('/:pid', productController.getProduct)
        this.InicioProduct.post('/',uploader.single('file') , productController.createProduct)
        this.InicioProduct.put('/:pid',uploader.single('file') , productController.updateProduct)
        this.InicioProduct.delete('/:pid',uploader.single('file') , productController.deleteProduct)
    }
    getRouter(){
        return this.InicioProduct
    }
}
export default new productRouter()
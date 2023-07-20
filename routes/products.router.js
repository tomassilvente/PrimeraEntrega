import { Router } from "express";
import {uploader} from '../utils.js'
import ProductManager from './management/ProductManager.js'
import Products from "./dao/dbManagers/products.js";

const router = Router()
export const productDBManager = new Products()
const manager = new ProductManager('public/data/products')

router.get('/', async(req, res)=>{
    //let products = await manager.getProducts()
    let products = await productDBManager.getAll()
    res.send({products})
})

router.get('/:pid', async(req, res)=>{
    //let product = await manager.getProductById(req.params.pid)
    let product = await productDBManager.getById(req.params.pid)
    res.send({product})
    
})

router.post('/',uploader.single('file'), async(req,res)=>{
    let product = req.body
    //manager.addProduct(product)
    let result = await productDBManager.saveProducts(product)
    res.send({status:"OK", message:"Producto agregado correctamente", payload:result})
})

router.put('/:pid',uploader.single('file'), function(req,res){
    let id = req.params.pid
    let product = req.body
    if(product.id)
        res.status(400).send({status:"Error", error:"No se puede modificar ID"})
    else productDBManager.uptdateProduct(id,product) //manager.updateProductById(id, product)
    res.send({status:"OK",message:"Producto Modificado Exitosamente"})
})

router.delete('/:pid',uploader.single('file'), function(req,res){
    let id = req.params.pid
    //manager.removeProductById(id)
    productDBManager.deleteProduct(id)
    res.send({status:"OK", message:"Productos completamente eliminados"})
})

export default router
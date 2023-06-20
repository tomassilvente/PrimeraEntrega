import { Router } from "express";
import {uploader} from '../utils.js'
import ProductManager from './management/ProductManager.js'

const router = Router()
const manager = new ProductManager('public/data/products')
export const productos = await manager.getProducts()

router.get('/', async(req, res)=>{
    let products = await manager.getProducts()
    res.send({products})
})

router.get('/:pid', async(req, res)=>{
    let product = await manager.getProductById(req.params.pid)
    res.send({product})
    
})

router.post('/',uploader.single('file'), function(req,res){
    let product = req.body
    manager.addProduct(product)
    res.send({status:"OK", message:"Producto agregado correctamente"})
})

router.put('/:pid',uploader.single('file'), function(req,res){
    let id = req.params.pid
    let product = req.body
    if(product.id)
        res.status(400).send({status:"Error", error:"No se puede modificar ID"})
    else manager.updateProductById(id, product)
    res.send({status:"OK",message:"Producto Modificado Exitosamente"})
})

router.delete('/:pid',uploader.single('file'), function(req,res){
    let id = req.params.pid
    manager.removeProductById(id)
    res.send({status:"OK", message:"Productos completamente eliminados"})
})

export default router
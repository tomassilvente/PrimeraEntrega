import { Router } from "express";
import { uploader } from "../utils.js";
import Carts from "./dao/dbManagers/carts.js";
import ProductManager from "./management/ProductManager.js";
import CartManager from "./management/CartsManager.js";

const router = Router()
const prodManager = new ProductManager('public/data/products')
const cartManager = new CartManager('public/data/carts')
const cartDBManager = new Carts()

router.get('/', async(req, res)=>{
    let cartsFS = await cartManager.getCarts()
    let cartsDB = await cartDBManager.getAll()
    if (cartsDB) res.send({status:'Success', payload:cartsDB})
    else res.status(400).send({status:"Error", error:"No se encontraron Carritos"})
})

router.get('/:cid', async(req, res)=>{
    let cart = await cartManager.getCartById(Number(req.params.cid))
    let cartDB = await cartDBManager.getById(Number(req.params.cid))
    if(cart) res.send({cart})
    else res.status(400).send({status:"Error", error:"No se encontró el producto."})
})

router.post('/', uploader.single('file'), async function(req,res){
    let products = req.body
    for(let i = 0; i< products.length ; i++)
        if(! await prodManager.getProductById(products[i].id)) res.status(400).send({status:"Error", error:"Producto no Encontrado en productos.JSON"})
    cartManager.addProducts(products)
    const result =  await cartDBManager.saveCarts()
    res.send({status:"OK", message:"Creado exitosamente",payload:result})  
})

router.post('/:cid/products/:pid',uploader.single('file'), function(req,res){
    let product = req.body
    let cid = Number(req.params.cid)
    let pid = Number(req.params.pid)
    if(product.length>1) res.status(400).send({status:"Error", error:"Solo se puede ingresar de a un producto en este metodo"})
    if(!product || !cid || !pid) res.status(400).send({status:"Error", error:"Producto o carrito no ingresado"})
    else{ 
        //cartManager.addProducts(cid, product, res)
        const result = cartDBManager.saveProduct(cid,pid)
        
        res.send({status:"OK", message:"Producto Agregado Correctamente", payload:result})
    }
})

export default router
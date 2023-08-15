import { Router } from "express";
import { uploader } from "../utils.js";
import Carts from "./dao/dbManagers/carts.js";
import ProductManager from "./management/ProductManager.js";
import CartManager from "./management/CartsManager.js";
import Products from "./dao/dbManagers/products.js";

const router = Router()
// const prodManager = new ProductManager('public/data/products')
// const cartManager = new CartManager('public/data/carts')
const prodDBManager = new Products
const cartDBManager = new Carts()

router.get('/', async(req, res)=>{
    //let cartsFS = await cartManager.getCarts()
    let cartsDB = await cartDBManager.getAll()
    if (cartsDB) res.send({status:'Success', payload:cartsDB})
    else res.status(400).send({status:"Error", error:"No se encontraron Carritos"})
})

router.get('/:cid', async(req, res)=>{
    //let cart = await cartManager.getCartById(Number(req.params.cid))
    let cartDB = await cartDBManager.getById(Number(req.params.cid))
    if(cartDB) res.send({cartDB})
    else res.status(400).send({status:"Error", error:"No se encontró el producto."})
})

router.post('/', uploader.single('file'), async function(req,res){
    let products = req.body
    for(let i = 0; i< products.length ; i++)
        if(! await prodDBManager.getById(products[i].id)) res.status(400).send({status:"Error", error:"Producto no Encontrado en productos.JSON"})
    // await cartManager.addProducts(products)
    const result =  await cartDBManager.saveCarts()
    res.send({status:"OK", message:"Creado exitosamente",payload:result})  
})

router.post('/:cid/products/:pid',uploader.single('file'), async(req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let product = await cartDBManager.getById(pid)
    if(product.length>1) res.status(400).send({status:"Error", error:"Solo se puede ingresar de a un producto en este metodo"})
    if(!product || !cid || !pid) res.status(400).send({status:"Error", error:"Producto o carrito no ingresado"})
    else{ 
        //cartManager.addProducts(cid, product, res)
        const result = await cartDBManager.saveProduct(pid,cid)
        
        res.send({status:"OK", message:"Producto Agregado Correctamente", payload:result})
    }
})

router.delete('/:cid/products/:pid', async(req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let prod = await prodDBManager.getById(pid)
    if(prod){
        await cartDBManager.deleteProduct(cid,pid)
        res.send({status:"OK", message:"Productos completamente eliminados"})
    }
    else res.status(400).send({status:"Error", error:"No se encontró el producto"})
})

router.put('/:cid', async(req,res)=>{
    let cid = req.params.cid
    let cart = req.body
    if(cart._id){
        res.status(400).send({status:"Error", error:"No se puede modificar ID"})
    }
    else await cartDBManager.updateCart(cid, cart)
    res.send({status:"OK", message:"Productos modificados"})
})

router.put('/:cid/products/:pid', async(req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let quant = req.body
    let prod = await prodDBManager.getById(pid)
    if(quant.quantity > 0 && prod){
        quant = quant.quantity
        await cartDBManager.updateProdCart(cid,pid,quant)
        res.send({status:"OK", message:"Productos modificados"})
    } 
    else res.status(400).send({status:"Error", error:"Ups! Algo salió mal"})
})

router.delete('/:cid', async(req,res)=>{
    let cid = req.params.cid
    let cart = await cartDBManager.getById(cid)
    if(cart){
        await cartDBManager.deleteAll(cid)
        res.send({status:"OK", message:"Todos los productos han sido completamente eliminados"})
    }
    else res.status(400).send({status:"Error", error:"No se encuentra el Carrito"})
})
export default router 
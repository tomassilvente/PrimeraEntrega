import { Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "./management/ProductManager.js";
import CartManager from "./management/CartsManager.js";

const router = Router()
const prodManager = new ProductManager('public/data/products')
const cartManager = new CartManager('public/data/carts')

router.get('/', async(req, res)=>{
    let carts = await cartManager.getCarts()
    if (carts) res.send({carts})
    else res.status(400).send({status:"Error", error:"No se encontraron Carritos"})
})

router.get('/:cid', async(req, res)=>{
    let cart = await cartManager.getCartById(Number(req.params.cid))
    if(cart) res.send({cart})
    else res.status(400).send({status:"Error", error:"No se encontró el producto."})
})

router.post('/', uploader.single('file'), async function(req,res){
    let products = req.body
    for(let i = 0; i< products.length ; i++)
        if(! await prodManager.getProductById(products[i].id)) res.status(400).send({status:"Error", error:"Producto no Encontrado en productos.JSON"})
    cartManager.addProducts(products)  
    res.send({status:"OK", message:"Creado exitosamente"}) 
      
})

router.post('/:cid/products/:pid',uploader.single('file'), function(req,res){
    let product = req.body
    let cart = Number(req.params.cid)
    if(product.length>1) res.status(400).send({status:"Error", error:"Solo se puede ingresar de a un producto en este metodo"})
    if(!product || !cart) res.status(400).send({status:"Error", error:"Producto o carrito no ingresado"})
    else{ 
        cartManager.addProducts(cart, product, res)
        res.send({status:"OK", message:"Producto Agregado Correctamente"})
    }
})

export default router
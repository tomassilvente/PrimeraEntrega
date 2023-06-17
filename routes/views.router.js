import express from "express"
import ProductManager from "./management/ProductManager.js"

const router = express.Router()

let prodMan = new ProductManager('public/data/products')

router.get('/', async(req,res)=>{
    let products = await prodMan.getProducts()
    res.render('home',{products})
})

router.get('/realtimeproducts', async(req, res)=>{
    let products = await prodMan.getProducts()
    res.render('realTimeProducts',{products})
})

export default router
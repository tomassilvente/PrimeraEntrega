import express from "express"
import Products from "./dao/dbManagers/products.js"

const router = express.Router()

//let prodMan = new ProductManager('public/data/products')
let productDBManager = new Products()

router.get('/home', async(req,res)=>{
    //let products = await prodMan.getProducts()
    let products = await productDBManager.getAll()
    res.render('home',{products})
})

router.get('/', async(req, res)=>{
    //let products = await prodMan.getProducts()
    let products = await productDBManager.getAll()
    res.render('realTimeProducts',{products})
})

router.get('/chat',async(req,res)=>{
    res.render("chat",{})
})

export default router
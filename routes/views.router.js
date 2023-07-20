import express from "express"
import Products from "./dao/dbManagers/products.js"
import Carts from "./dao/dbManagers/carts.js"
import { productsModel } from "./dao/models/products.js"

const router = express.Router()

//let prodMan = new ProductManager('public/data/products')
let productDBManager = new Products()
let cartsDBManager = new Carts()

router.get('/realTimeProducts', async(req, res)=>{
    //let products = await prodMan.getProducts()
    //let products = await productDBManager.getAll()
    const {page = 1, limit = 10, sort = 1} = req.body
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink} = 
        await productsModel.paginate({}, {limit, page, lean:true})
        const products = docs
        res.render('realTimeProducts',{
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink
        })
})

router.get('/', async(req, res)=>{
    const {page = 1, limit = 10, sort = 1, query} = req.body
    const {docs, status, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, nextLink, prevLink} = 
        await productsModel.paginate({}, {limit, page, lean:true})
        const products = docs
        res.render('products',{
            status,
            totalPages,
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            nextLink,
            prevLink
        })    
})

router.get('/products/:id', async(req,res)=>{
    const id = req.params.id
    const {title, description, category, price, code, stock, _id} = await productDBManager.getById(id)  
    res.render('product',{title, description, category, price, code, stock, _id})
})

router.get('/products/:cid/:pid/add', async(req, res)=>{
    const pid = req.params.pid
    const cid = req.params.cid
    await cartsDBManager.saveProduct(pid,cid)
    const {title, description, category, price, code, stock, _id} = await productDBManager.getById(pid)
    res.render('product',{title, description, category, price, code, stock, _id})
})

router.get('/chat',async(req,res)=>{
    res.render("chat",{})
})

router.get('/carts/:cid', async(req, res)=>{
    const cid = req.params.cid
    const {_id, products} = await cartsDBManager.getById(cid)
    const productos = []
    for(let a=0; a < products.length; a++){
        let prod = await productDBManager.getById(products[a]._id)
        productos.push(prod.title)     
    }
    res.render("cart",{_id, productos})


    
})

export default router
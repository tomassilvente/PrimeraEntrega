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
            user: req.session.user,
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

router.post('/products/:cid/:pid/add', async(req, res)=>{
    const pid = req.params.pid
    const cid = req.params.cid
    const prod = await productDBManager.getById(pid)
    if(prod){
        await cartsDBManager.saveProduct(pid,cid)
        const {title, description, category, price, code, stock, _id} = await productDBManager.getById(pid)
        res.render('product',{title, description, category, price, code, stock, _id})
    }
    else res.status(400).send({status:"Error", error:"Producto no encontrado"})
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

function auth(req,res,next){
    console.log(req.session.user.admin)
    if(req.session.user.admin) return next()
    else return res.status(403).send("Usuario no autorizado para ingresar aquí")
}

router.get('/private', auth, (req, res)=>{
    res.send("Buen dia ADMIN!!!!")
})

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", async(req, res) => {
  res.render("login");
});

router.get('/logout', (req,res)=>{
    try{
        req.session.destroy()
        res.render('login',{message:'Sesión cerrada correctamente'})
    }
    catch(error){
        return res.return(400).send({status:"error", error: error})
    }
})

router.get("/profile", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

export default router
import express from "express"
import Products from "../services/products.service.js"
import Carts from "../services/carts.service.js"
import { productsModel } from "../models/products.model.js"


const router = express.Router()


router.get('/realTimeProducts', async(req, res)=>{
    //let products = await prodMan.getProducts()
    //let products = await Products.getAll()
    const {page = 1, limit = 8, sort = 1, query} = req.query
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
    const {page = 1, limit = 8, sort = 1, query} = req.query
    const {docs, status, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, nextLink, prevLink} = 
        await productsModel.paginate({}, {limit, page, lean:true})
        let products = docs
        if(query){
            products = await productsModel.aggregate([
                {
                    $match: {category: query}
                }
            ])
        }
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
    const {title, description, category, price, code, stock, _id} = await Products.getById(id)  
    res.render('product',{title, description, category, price, code, stock, _id})
})

router.get('/products/:cid/:pid/add', async(req, res)=>{
    const pid = req.params.pid
    const cid = req.params.cid
    const prod = await Products.getById(pid)
    if(prod){
        await Carts.saveProduct(pid,cid)
        res.redirect(`/products/${pid}`)
    }
    else res.status(400).send({status:"Error", error:"Producto no encontrado"})
})

router.get('/chat',async(req,res)=>{
    res.render("chat",{})
})

router.get('/carts/:cid', async(req, res)=>{
    const cid = req.params.cid
    const {_id, products} = await Carts.getById(cid)
    const productos = []
    let total = 0
    for(let a=0; a < products.length; a++){
        let prod = await Products.getById(products[a]._id)  
        let subT = prod.price * products[a].quantity
        total += subT
        productos.push({id:prod._id, title: prod.title, price:prod.price, subT:subT ,quantity:products[a].quantity})     
    }
    res.render("cart",{_id, productos, total})    
})

router.get('/deleteProd/:cid/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        await Carts.deleteProduct(cid, pid)
        res.redirect(`/carts/${cid}`)
    }
    catch(error){
        res.status(400).send({status:"Error", error:error})
    }
    
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
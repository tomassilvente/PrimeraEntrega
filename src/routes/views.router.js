import express from "express"
import Products from "../services/products.service.js"
import Carts from "../services/carts.service.js"
import { productsModel } from "../models/schemas/products.schema.js"
import { isClient } from "../utils.js"
import userModel from "../models/schemas/Users.schema.js"


const router = express.Router()

router.get('/realTimeProducts', async(req, res)=>{
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
        if(req.session.user){
            let admin = (req.session.user.role ==='admin')
            res.render('products',{
                user: req.session.user,
                admin,
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
        }
        else res.redirect('/login')
})

router.get('/products/:id', async(req,res)=>{
        const id = req.params.id
        const user = req.session.user
        console.log(req.session)
        const {title, description, category, price, code, stock, _id} = await Products.getById(id)  
        res.render('product',{user, title, description, category, price, code, stock, _id})
})

router.get('/products/:cid/:pid/add', isClient, async(req, res)=>{
        const pid = req.params.pid
        const cid = req.params.cid
        const prod = await Products.getById(pid)
        if(prod){
            await Carts.saveProduct(pid,cid)
            res.redirect(`/products/${pid}`)
        }
        else req.logger.fatal(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
})

router.get('/chat' ,async(req,res)=>{
    if (req.session.user.role === 'client') res.render("chat",{})
    else res.status(403).send("Usuario no autorizado para ingresar aquí")
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

router.get('/:cid/purchase', async(req, res)=>{
    const cid = req.params.cid
    const user = req.session.user
    let ticket = await Carts.purchaseCart(cid,user)
    console.log(ticket)
    res.render("ticket",{ticket})
})

function auth(req,res,next){
    console.log(req.session.user.admin)
    if(req.session.user.role === 'admin') return next()
    else return res.status(403).send("Usuario no autorizado para ingresar aquí")
}

router.get('/resetPassword', (req, res)=>{
    res.render("resetPassword")
})

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

router.get('/test-logger', (req, res)=>{
    req.logger.error("Esto es un error")
    req.logger.warn("Esto es un warn")
    req.logger.info("Esto es un info")
    req.logger.http("Esto es un http")
    req.logger.debug("Esto es un debug")
    req.logger.fatal("Esto es un fatal")
    res.send("Probando loggers")
})

router.get('/users', async(req,res)=>{
    const users = await userModel.find()
    const usuarios = []
    for(let a=0; a<users.length; a++){
        let user = users[a]
        usuarios.push({first_name:user.first_name, last_name: user.last_name, email: user.email, role:user.role, id:user._id})
    }
    res.render('users',{usuarios})
})

router.get('/editUser/:uid' ,async(req, res)=>{
    let id = req.params.uid
    const {first_name, _id, last_name, email, role} = await userModel.findById(id)
    // const usuario = []
    // usuario.push({first_name:user.first_name, last_name: user.last_name, email: user.email, role:user.role, id:user._id})
    // console.log(usuario)
    res.render('editUser',{first_name, _id, last_name, email, role})
})

export default router
import express from 'express'
import session from 'express-session'
import handlebars from "express-handlebars"
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import {__dirname} from "./utils.js"
import CONFIG from './config/config.js'
import initPassport from './config/passport.config.js'

import sessionRouter from './routes/session.router.js'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewRouter from './routes/views.router.js'
import Products from './services/products.service.js'

const app = express()
const PORT = process.env.PORT
const URI = process.env.MONGO_URI
const httpserver = app.listen(CONFIG.PORT, () => console.log("Server Arriba"))
const socketServer = new Server(httpserver)
// mongoose.connect(
//     CONFIG.MONGO_URL,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }
// )
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{ useNewUrlParser:true, useUnifiedTopology:true},
        ttl:3600
    }),
    secret:"12345abcd",
    resave:false,
    saveUninitialized:false
}))

initPassport();
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))

app.use(cookieParser())
app.use('/', viewRouter)
app.use('/api/products',productRouter.getRouter())
app.use('/api/carts',cartRouter.getRouter())
app.use('/api/session',sessionRouter)


let products = await Products.getAll()
const message = []

socketServer.on('connection', socket=>{
    console.log("Comunición Cliente <--> Servidor")   
    socketServer.emit('products',{products})
        
    socket.on('products',async data=>{
        await Products.saveProducts(data)
        products = await Products.getAll()
        socketServer.emit('products',{products})
    })

    socket.on('eliminar', async data=>{
        await Products.deleteProduct(data)
        products = await Products.getAll()
        socketServer.emit('products',{products})
    })

    socket.on('message',data=>{
        message.push(data)
        socketServer.emit('messageLog',message)
    })
})

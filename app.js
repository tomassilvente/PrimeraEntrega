import express from 'express'
import session from 'express-session'
import handlebars from "express-handlebars"
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import FileStore from 'session-file-store'

import { productDBManager } from './routes/products.router.js'
import {__dirname} from "./utils.js"

import productsRouter from './routes/products.router.js'
import carsRouter from './routes/carts.router.js'
import viewRouter from './routes/views.router.js'
import sessionRouter from './routes/session.router.js'

const fileStorage = FileStore(session)
const app = express()
const httpserver = app.listen(8080, () => console.log("Server Arriba"))
const socketServer = new Server(httpserver)
mongoose.connect(
    "mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

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

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))

app.use(cookieParser())
app.use('/', viewRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',carsRouter)
app.use('/api/session',sessionRouter)


let products = await productDBManager.getAll()
const message = []

socketServer.on('connection', socket=>{
    console.log("Comunición Cliente <--> Servidor")   
    socketServer.emit('products',{products})
        
    socket.on('products',async data=>{
        await productDBManager.saveProducts(data)
        products = await productDBManager.getAll()
        socketServer.emit('products',{products})
    })

    socket.on('eliminar', async data=>{
        await productDBManager.deleteProduct(data)
        products = await productDBManager.getAll()
        socketServer.emit('products',{products})
    })

    socket.on('message',data=>{
        message.push(data)
        socketServer.emit('messageLog',message)
    })
})

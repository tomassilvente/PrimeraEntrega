import express from 'express'
import productsRouter from './routes/products.router.js'
import carsRouter from './routes/carts.router.js'
import viewRouter from './routes/views.router.js'
import handlebars from "express-handlebars"
import { manager } from './routes/products.router.js'
import {__dirname} from "./utils.js"
import { Server } from 'socket.io'

const app = express()
const httpserver = app.listen(8080, () => console.log("Server Arriba"))

const socketServer = new Server(httpserver)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))

app.use('/', viewRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',carsRouter)

let products = await manager.getProducts()

socketServer.on('connection', socket=>{
    console.log("Comunicandome")   
    socketServer.emit('products',{products})
        
    socket.on('products',async data=>{
        await manager.addProduct(data)
        products = await manager.getProducts()
        socketServer.emit('products',{products})
    })

    socket.on('eliminar', async data=>{
        await manager.removeProductById(data)
        products = await manager.getProducts()
        socketServer.emit('products',{products})
    })
})

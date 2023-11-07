import express from 'express'
import session from 'express-session'
import handlebars from "express-handlebars"

import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import swaggerJSDoc from 'swagger-jsdoc'
import { serve, setup } from 'swagger-ui-express'

import {__dirname} from "./utils.js"
import CONFIG from './config/config.js'
import initPassport from './config/passport.config.js'
import  jwt  from "jsonwebtoken";
import usersRouter from './routes/users.router.js'
import sessionRouter from './routes/session.router.js'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewRouter from './routes/views.router.js'
import Products from './services/products.service.js'
import addLogger from './middleware/logger.middleware.js'

const app = express()
const httpserver = app.listen(CONFIG.PORT, () => console.log("Server Arriba"))
const socketServer = new Server(httpserver)

app.use(session({
    store: MongoStore.create({
        mongoUrl:CONFIG.MONGO_URL ,
        mongoOptions:{ useNewUrlParser:true, useUnifiedTopology:true},
        ttl:3600
    }),
    secret:"12345abcd",
    resave:false,
    saveUninitialized:false
}))

const swaggerOption ={
    definition:{
        openapi: '3.0.0',
        info:{
            title:'Documentación de la API',
            description:' Info de los Carts y Productos ',
            version: '1.0.0',
            contact:{
                name: 'Tomás Silvente',
                url: 'https://www.linkedin.com/in/tomas-silvente-a4b1951b2/'
            }
        }
    },
    // apis:[`${process.cwd()}/docs/*.yaml`],
    // apis:[`${__dirname}/docs/**/*.yaml`],
    apis:[`./docs/*.yaml`],
    
}
const spec = swaggerJSDoc(swaggerOption)

initPassport();
app.use(passport.initialize())
app.use(cookieParser())
app.use(passport.session())

app.use(addLogger)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))

app.use('/', viewRouter)
app.use('/api/products',productRouter.getRouter())
app.use('/api/carts',cartRouter.getRouter())
app.use('/api/session',sessionRouter)
app.use('/api/users',usersRouter)
app.use('/apidocs',serve, setup(spec))

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


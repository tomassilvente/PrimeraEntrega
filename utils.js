import {fileURLToPath} from 'url'
import {dirname} from 'path'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+'/public/data')
        console.log("Ubicacion "+cb)
    },
    filename: function(req, file, cb){
        console.log(file)
        cb(null, file.originalname)
    }
})

const KEY = "CoderTokenKey"


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user)=>{
    const token = jwt.sign({user},KEY,{expiresIn:'12h'})
    return token
}

export const authToken = (req,res, next)=>{
    const headerAuth = req.headers.authorization
    if(!headerAuth) return res.status(401).send({status:'error', error:"No se proporcionó un token de autorización" })

    const token = headerAuth.split(' ')[1]

    jwt.verify(token, KEY, (error, credentials) =>{
        if(error) return res.status(401).send({status:'error', error: "Token inválido o expirado"})
        req.user = credentials.user
        next()
    })
}

export const isAdmin = (req, res, next) =>{
    if(req.isAuthenticated() && req.session.user && req.session.user.role ==='admin'){
        return next()
    }
    res.status(403).json({error:"Acceso no autorizado"})
}

export const isClient = (req, res, next) =>{
    console.log(req.session.user.role)
    if(req.session.user.role ==='client'){
        return next()
    }
    res.status(403).json({error:"Acceso no autorizado"})
}

export const __dirname = dirname(__filename)
export const uploader = multer({storage})
import passport from 'passport'
import local from 'passport-local'
import userModel from "../models/schemas/Users.schema.js"
import {createHash, isValidPassword} from '../utils.js'
import GitHubStrategy from 'passport-github2'
import cartsModel from '../models/schemas/carts.schema.js'

const LocalStrategy = local.Strategy

const initPassport = async() =>{
    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.5fe91e9f7a0acd82",
        clientSecret:"8a0d22086d50882e5638660402d09e4d6f4ffee9",
        callbackURL:"http://localhost:8080/api/session/githubcallback"
    },
    async (accesToken, refreshToken, profile, done)=>{
        try{
            let user = await userModel.findOne({email:profile._json.email})
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: '',
                    password: '',
                    cart: ''
                }
                let result = await userModel.create(newUser)
                done(null, result)
            }
            else done(null, user)
        } catch (error) {return done(error)}   
    }
    ))

    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: "email", session:false},
    async(req, email, password, done)=>{
        try{
            const {first_name, last_name, email, age} = req.body
            const cart = await cartsModel.create({products:[]})
            if(!first_name || !last_name || !email ||!age) return done(null, false, {message:"Incomplete values"})
            let user = await userModel.findOne({email: email})
            if(user) return console.log('user already exists')
            const newUser = {first_name, last_name, email, age, cart, password: createHash(password)}
            let result = await userModel.create(newUser)
            return done(null, result)
        }
        catch (error){
            return done("Error de usuario "+ error)
        }
    }
    ))

    passport.use('login', new LocalStrategy({passReqToCallback:true, usernameField:"email", session: false},
    async(req, email, password, done)=>{
        try{
            const user = await userModel.findOne({email: email})
            if(!user) return done(null, false, {message:"User not found"})
            const validatePassword = isValidPassword(user, password)
            if(!validatePassword) return done(null, false, {message:"Password Incorrect"})
            return done(null, user)
        }
        catch(error){
            return done(error)
        }
    }
    ))

    passport.serializeUser((user,done)=>{
    done(null,user._id)
    })

    passport.deserializeUser(async(id,done)=>{
    let user= await userModel.findById(id)
    return done(null,user)
    })
}

export default initPassport;
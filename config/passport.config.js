import passport from 'passport'
import local from 'passport-local'
import userModel from "../models/Users.model.js"
import {createHash, isValidPassword} from '../utils.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initPassport = () =>{
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
                    password: ''
                }
                let result = await userModel.create(newUser)
                done(null, result)
            }
            else done(null, user)
        } catch (error) {return done(error)}   
    }
    ))

    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: "email"},
    async(req, username, password, done)=>{
        const {first_name, last_name, email, age} = req.body
        try{
            let user = await userModel.findOne({email: username})
            if(user) console.log('user already exists')
            const newUser = {first_name, last_name, email, age, password: createHash(password)}
            let result = await userModel.create(newUser)
        }
        catch (error){
            return done("Error de usuario "+ error)
        }
    }
    ))
}

passport.serializeUser((user,done)=>{
    done(null,user.id)
  })

  passport.deserializeUser(async(id,done)=>{
    let user= await userModel.findById(id)
    done(null,user)
  })

export default initPassport;
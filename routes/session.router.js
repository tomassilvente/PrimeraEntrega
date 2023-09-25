import { Router } from "express";
import passport from "passport";
import  jwt  from "jsonwebtoken";
import {authToken, createHash,isValidPassword } from "../utils.js";
import MailingService from "../services/mailing.js";
import  userModel  from "../models/schemas/Users.schema.js"

const router=Router();

router.post('/register',passport.authenticate('register',{ passReqToCallback:true , failureRedirect:'/failRegister', session:false, failureMessage:true}),async(req,res)=>{
    res.redirect('/login')
    // res.send({ status: "success", message: "User registered" });
})

router.post('/login',passport.authenticate('login',{ passReqToCallback:true ,failureRedirect:'/failLogin', session:false, failureMessage:true}),async(req,res)=>{
    const serialUser = {
        id:req.user._id,
        name:`${req.user.first_name} ${req.user.last_name}`,
        role:req.user.role,
        email:req.user.email,
        cart: req.user.cart
    };
    req.session.user = serialUser
    const token = jwt.sign(serialUser,'coderUser',{expiresIn:"1h"})
    res.cookie('cookie', token,{maxAge:36000000}).send({status:"Success", payload: serialUser})
})

router.get('/failLogin', (req,res)=>{
    res.send({error:"Failed"})
})

router.get('/failRegister', async(req,res)=>{
    res.send({error:"Failed"})
})

router.get('/current', authToken, (req,res) =>{
    res.send({status:"Success", payload:req.session.user})
})

router.get('/sendMailReset',  async(req,res)=>{
    try{
        const mailer = new MailingService()
        let result = await mailer.sendSimpleMail({
            from: 'tomassilvente3@gmail.com',
            to: req.session.user.email,
            subject: 'Cambio de contraseña',
            html:`<div>  
                    <h1>Si usted pidió un cambio de constraseña, ingrese en el siguiente enlace </h1>
                    <a href='https://proyectocoderhouse.onrender.com/resetPassword'> </a>
                  </div>`,
        })
        res.redirect('/')
    }
    catch(error){
        console.log(error)
    }
})

router.post('/changePassword', async(req, res)=>{
    let user = await userModel.findOne({email:req.session.user.email})
    let data= req.body
    let expassword = data.expassword
    let newpassword = data.newpassword
    if(isValidPassword(user, expassword) && newpassword != expassword)   await userModel.updateOne({_id:user.id},{$set:{'password': createHash(newpassword)}})
    else console.log(user.password, expassword, newpassword)
    res.cookie('cookie',{maxAge:36000000})
    res.redirect('/')
})

router.post('/logout', async(req, res)=>{
    try{
        req.session.destroy()
        res.send({status:"success", message:"Sesión cerrada."})
    }
    catch(error){res.status(400).send({status:"error", error: error})}
})

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res)=>{
    
})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:"/login"}), async(req, res)=>{
    req.session.user={
        name:`${req.user.name}`,
        role:req.user.role,
        email:req.user.email,
        cart: req.user.cart
    }
    res.redirect('/')
})

export default router;
import { Router } from "express";
import passport from "passport";
import userModel from "../models/Users.model.js";
import  jwt  from "jsonwebtoken";
import { generateToken, createHash, isValidPassword, authToken } from "../utils.js";

const router=Router();

router.post('/register',passport.authenticate('register',{ passReqToCallback:true , failureRedirect:'/failRegister', session:false, failureMessage:true}),async(req,res)=>{
    res.send({ status: "success", message: "User registered" });
})

router.post('/login',passport.authenticate('login',{ passReqToCallback:true ,failureRedirect:'/failLogin', session:false, failureMessage:true}),async(req,res)=>{
    const serialUser = {
        id:req.user._id,
        name:`${req.user.first_name}`,
        role:req.user.role,
        email:req.user.email,
    };

    const token = jwt.sign(serialUser,'coderUser',{expiresIn:"1h"})

    res.cookie('cookie', token,{maxAge:36000000}).send({status:"Success", payload: serialUser})
})

router.get('/failLogin', (req,res)=>{
    res.send({error:"Failed"})
})

router.get('/failRegister', async(req,res)=>{
    res.send({error:"Failed"})
})

// router.post('/login',async(req,res)=>{
//     try{ 
//         const { email, password } = req.body;

//         if (!email || !password) return res.status(400).send({ status: "error", error: "Error User" });

//         const user = await userModel.findOne(
//             { email: email },
//             { email: 1, first_name: 1, last_name: 1, password: 1 }
//         );
//         const acceso =  generateToken(user)
//         let adm = false
//         let rol = 'client'
//         if (!user)
//             return res.status(400).send({ status: "error", error: "Error User" });
//         if (!isValidPassword(user, password))
//             return res.status(403).send({ status: "error", error: "Error Credential" });
//         if(email === 'adminCoder@coder.com' && password ==='adminCod3r123') {
//             adm = true
//             rol = 'admin'
//         }
//         req.session.user = {
//             name: `${user.first_name} ${user.last_name}`,
//             email:user.email,
//             age: user.age,
//             admin: adm,
//             rol: rol
//         };
//         res.send({ status: "success", payload: user ,acceso});
//     }
//     catch(error){res.return(400).send({status:"error", error: error})}
    
// })

router.get('/current', authToken, (req,res) =>{
    res.send({status:"Success", payload:req.user})
})

router.post('/logout', async(req, res)=>{
    try{
        req.session.destroy()
        res.send({status:"success", message:"Sesión cerrada."})
    }
    catch(error){res.return(400).send({status:"error", error: error})}
})

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res)=>{
    
})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:"/login"}), async(req, res)=>{
    req.session.user = req.user
    res.redirect('/')
})

export default router;
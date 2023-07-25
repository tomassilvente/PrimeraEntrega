import { Router } from "express";
import userModel from "../models/Users.model.js";

const router=Router();

router.post('/register',async(req,res)=>{
    const { first_name,last_name,email, age, password}=req.body;
    const exist =await userModel.findOne({email});

    if(exist) return res.status(400).send({status:"error",error:"Users already exists"})

    const user={
        first_name,
        last_name,
        email,
        age,
        password
    }
    let result = await userModel.create(user)
    res.send({status:"success",message:"User registered"})
})


router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    const user = await userModel.findOne({email,password});
    let adm = false
    let rol = 'usuario'
    if(!user) return res.status(400).send({status:"error",error:"Incorrect credentials"})
    if(email === 'adminCoder@coder.com' && password ==='adminCod3r123') {
        adm = true
        rol = 'admin'
    }
    req.session.user={
        name: `${user.first_name} ${user.last_name}`,
        email:user.email,
        age: user.age,
        admin: adm,
        rol: rol
    }
    res.send({status:"success",payload:req.session.user, message:"Nuestro primer logueo"})
})

router.post('/logout', async(req, res)=>{
    req.session.destroy()
    res.send({status:"success", message:"Sesión cerrada."})
})

export default router;
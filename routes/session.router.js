import { Router } from "express";
import passport from "passport";
import userModel from "../models/Users.model.js";
import { generateToken, createHash, isValidPassword, authToken } from "../utils.js";

const router=Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/failRegister'}),async(req,res)=>{
    // const { first_name, last_name, email, age, password } = req.body;
    // if (!first_name || !last_name || !email || !age) return res.status(400).send({ status: "error", error: "Error User" });
    // const user = {
    //     first_name,
    //     last_name,
    //     email,
    //     age,
    //     password: createHash(password),
    // };
    // let result = await userModel.create(user);
    res.send({ status: "success", message: "User registered" });
})

router.get('/failRegister', async(req,res)=>{
    res.send({error:"Failed"})
})

router.post('/login',async(req,res)=>{
    try{
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "Error User" });

        const user = await userModel.findOne(
            { email: email },
            { email: 1, first_name: 1, last_name: 1, password: 1 }
        );
        const acceso =  generateToken(user)
        let adm = false
        let rol = 'usuario'
        if (!user)
            return res.status(400).send({ status: "error", error: "Error User" });
        if (!isValidPassword(user, password))
            return res.status(403).send({ status: "error", error: "Error Credential" });
        if(email === 'adminCoder@coder.com' && password ==='adminCod3r123') {
            adm = true
            rol = 'admin'
        }
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email:user.email,
            age: user.age,
            admin: adm,
            rol: rol
        };
        res.send({ status: "success", payload: user ,acceso});
    }
    catch(error){res.return(400).send({status:"error", error: error})}
    
})

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
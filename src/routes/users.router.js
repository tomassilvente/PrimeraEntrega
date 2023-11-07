import { Router } from "express";
import userModel from "../models/schemas/Users.schema.js";

const router=Router();

router.get('/', (req,res) =>{
    let users = userModel.find()
    res.send({status:"Success", payload: users})
})

router.delete('/', (req,res) =>{
    let user = req.body
    if(user) users = userModel.deleteOne(user)
    let users = userModel.deleteMany(userModel.find())
    res.send({status:"Success", payload: users})
})

router.put('/:uid', async(req, res)=>{
    let uid = req.params.uid
    let newUs = req.body
    let usuario = await userModel.findById(uid)
    if(usuario)
        if(newUs.first) usuario.first_name = newUs.first
        if(newUs.last) usuario.last_name = newUs.last
        if(newUs.email) usuario.email = newUs.email
        if(newUs.role) usuario.role = newUs.role
    let result =  await userModel.updateOne({_id:usuario._id}, usuario)
    res.send({status:"Success", payload: result})
})

export default router;
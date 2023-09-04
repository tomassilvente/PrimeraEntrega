import {getDAOS} from "../models/daos/indexDAO.js";
import { HttpError, HTTP_STATUS } from '../utils/resourses.js'

const {Carts} = getDAOS()

class CartsServices{
    getAll = async(id) =>{
        let result = Carts.getAll(id)
        if (!result) throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        else return result
    }

    getById = async id=>{
        if(!id) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        const result = await Carts.getById(id)
        if (!result) throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        else return result
    }

    saveCarts = async (cart = [])=>{
        if(cart){
            let result = await Carts.saveCarts(cart)
            return result
        }
        else throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
    }
    
    saveProduct = async (pid, cid) =>{
        if(!cid || !pid) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.saveProduct(pid, cid)
            return result
        }
    }

    deleteProduct = async(cid,pid) =>{
        if(!cid || !pid) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.deleteProduct(pid, cid)
            return result
        }
    }
    
    purchaseCart = async(cid)=>{
        if(!cid ) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.purchaseCart(cid)
            return result
        }
    }

    updateCart = async(cid, newCart)=>{
        if(!cid || !newCart) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.updateCart(cid, newCart)
            return result
        }
    }

    updateProdCart = async(cid, pid, quant) =>{
        if(!cid || !pid || !quant) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.updateProdCart(cid, pid, quant)
            return result
        }
    }

    deleteAll = async(cid) =>{
        if(!cid) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        else{
            let result = await Carts.deleteAll(cid)
            return result
        }
    }
}

export default new CartsServices()
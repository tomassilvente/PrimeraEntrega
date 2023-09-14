import {getDAOS} from "../models/daos/indexDAO.js";
import { HttpError, HTTP_STATUS } from '../utils/resourses.js'
import customError from "../utils/customErrors.js";

const {Carts} = getDAOS()

class CartsServices{
    getAll = async(id) =>{
        let result = Carts.getAll(id)
        if (!result) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener carros",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"Fallo en el intento de obtener carros",
            code: EError.INVALID_TYPES_ERROR
        })))
        else return result
    }

    getById = async id=>{
        if(!id) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener carro",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
        const result = await Carts.getById(id)
        if (!result) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener carro",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"Fallo en el intento de obtener carro",
            code: EError.INVALID_TYPES_ERROR
        })))
        else return result
    }

    saveCarts = async (cart = [])=>{
        if(cart){
            let result = await Carts.saveCarts(cart)
            return result
        }
        else req.logger.fatal(new HttpError(customError.createError({
            name:"Error al crear carro",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
    }
    
    saveProduct = async (pid, cid) =>{
        if(!cid || !pid) req.logger.fatal(new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST))
        else{
            let result = await Carts.saveProduct(pid, cid)
            return result
        }
    }

    deleteProduct = async(cid,pid) =>{
        if(!cid || !pid) req.logger.fatal(new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST))
        else{
            let result = await Carts.deleteProduct(cid, pid)
            return result
        }
    }
    
    purchaseCart = async(cid, user)=>{
        if(!cid ) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al comprar carro",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
        else{
            let result = await Carts.purchaseCart(cid,user)
            return result
        }
    }

    updateCart = async(cid, newCart)=>{
        if(!cid || !newCart) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al actualizar carro",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
        else{
            let result = await Carts.updateCart(cid, newCart)
            return result
        }
    }

    updateProdCart = async(cid, pid, quant) =>{
        if(!cid || !pid || !quant) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al actualizar producto en el carro",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
        else{
            let result = await Carts.updateProdCart(cid, pid, quant)
            return result
        }
    }

    deleteAll = async(cid) =>{
        if(!cid) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al eliminar carros",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"faltan datos",
            code: EError.INVALID_TYPES_ERROR
        }) ))
        else{
            let result = await Carts.deleteAll(cid)
            return result
        }
    }
}

export default new CartsServices()
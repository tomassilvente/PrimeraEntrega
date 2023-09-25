import { HttpError, HTTP_STATUS } from '../utils/resourses.js'
import {getDAOS} from '../models/daos/indexDAO.js'
import customError from '../utils/customErrors.js'
import { isAdmin } from '../utils.js'

const {Products} = getDAOS()

class ProductsService{
   async getAll(){
    let result = Products.getAll()
        if (!result) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener productos",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"Fallo en el intento de obtener productos",
            code: EError.INVALID_TYPES_ERROR
        })))
        else return result
    }

    getById = async (id)=>{
        if(!id) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener producto",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
        const result = await Products.getById(id)
        if (!result) req.logger.fatal(new HttpError(customError.createError({
            name:"Error al obtener producto",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"Fallo en el intento de obtener producto",
            code: EError.INVALID_TYPES_ERROR
        })))
        else return result
    }

    saveProducts = async product=>{
        if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
            let result = await Products.saveProducts(product)
            console.log(result)
            return result
        }
        else req.logger.fatal(new HttpError(customError.createError({
            name:"Error al crear producto",
            cause: HTTP_STATUS.BAD_REQUEST,
            message:"Faltan datos",
            code: EError.INVALID_TYPES_ERROR
        })))
    }

    updateProduct = async (id,prod)=>{
        let product = await Products.getById(id)
        if(product)
            if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
                if(product.owner === req.session.user.email || isAdmin)
                    await productsModel.updateProduct({_id:id}, prod)
            }
            else req.logger.fatal(new HttpError(customError.createError({
                name:"Error al actualizar producto",
                cause: HTTP_STATUS.BAD_REQUEST,
                message:"Faltan datos",
                code: EError.INVALID_TYPES_ERROR
            })))
        const result = await productsModel.findById(id)
        return result
    }

    deleteProduct = async id=>{
        let product = await Products.getById(id)
        if(product) 
            if(product.owner === req.session.user.email)
                await Products.deleteProduct({_id:id})
        else  req.logger.fatal(new HttpError(customError.createError({
            name:"Error al eliminar producto",
            cause: HTTP_STATUS.NOT_FOUND,
            message:"productos no encontrados",
            code: EError.INVALID_TYPES_ERROR
        })))
    }
}
export default new ProductsService()
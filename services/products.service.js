import { HttpError, HTTP_STATUS } from '../utils/resourses.js'
import {getDAOS} from '../models/daos/indexDAO.js'

const {Products} = getDAOS()

class ProductsService{
   async getAll(){
    let result = Products.getAll()
        if (!result) throw new HttpError('Products not found', HTTP_STATUS.NOT_FOUND)
        else return result
    }

    getById = async (id)=>{
        if(!id) throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        const result = await Products.getById(id)
        if (!result) throw new HttpError('Products not found', HTTP_STATUS.NOT_FOUND)
        else return result
    }

    saveProducts = async product=>{
        if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
            let result = await Products.saveProducts(product)
            return result
        }
        else throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
    }

    updateProduct = async (id,prod)=>{
        let product = await Products.getById(id)
        if(product)
            if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
                await productsModel.updateProduct({_id:id}, prod)
            }
            else throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)    
        const result = await productsModel.findById(id)
        return result
    }

    deleteProduct = async id=>{
        let product = await Products.getById(id)
        if(product) await Products.deleteProduct({_id:id})
        else throw new HttpError('Products not found', HTTP_STATUS.NOT_FOUND)
    }
}
export default new ProductsService()
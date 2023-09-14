import Products from '../services/products.service.js'
import { generateProduct } from '../utils/mock.utils.js';
import { HTTP_STATUS, successResponse } from '../utils/resourses.js';

class ProductsController{
    async getProducts (req, res){
        try{
            let products = await Products.getAll()
            const response = successResponse(products);
            res.status(HTTP_STATUS.OK).json(response)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

    async getProduct (req, res){
        try{
            let product = await Products.getById(req.params.pid)
            const response = successResponse(product);
            res.status(HTTP_STATUS.OK).json(response)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

    async createProduct (req,res){
        try{
            let product = req.body
            let result = await Products.saveProducts(product)
            const response = successResponse(result);
            res.status(HTTP_STATUS.CREATED).json(response)        
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

    async mockingProducts(req,res){
        try{
            const total =+ req.query.total || 100
            const products = Array.from({length:total}, () => generateProduct())
            for(let aux=0; aux<total; aux++){
                await Products.saveProducts(products[aux])
            }
            res.status(HTTP_STATUS.CREATED).json(products)
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
        
    }

    async updateProduct (req,res){
        try{
            let id = req.params.pid
            let product = req.body
            if(product.id)
            res.status(HTTP_STATUS.BAD_REQUEST) 
            else {
                result =  await Products.uptdateProduct(id,product)
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response)  
            }
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }

    async deleteProduct (req,res){
        try{
            let id = req.params.pid
            let result = await Products.deleteProduct(id)
            const response = successResponse(result);
            res.status(HTTP_STATUS.OK).json(response)          
        }
        catch(error){
            req.logger.error(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
        }
    }
}

export default new ProductsController()
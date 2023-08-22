import { productsModel } from "../models/products.model.js";

class Products{
    constructor(){
        console.log("Productos trabajando con DB Mongo")
    }

    getAll = async()=>{
        let products = await productsModel.find().lean()
        return products
    }

    getById = async id=>{
        let result = await productsModel.findById(id)
        return result
    }

    saveProducts = async product=>{
        if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
            let result = await productsModel.create(product)
            return result
        }
        else return console.log("Datos Faltantes")
    }

    updateProduct = async (id,prod)=>{
        let product = await productsModel.findById(id)
        if(product)
            if(product.title || product.description || product.code || product.price || product.stock || product.category || product.price){
                await productsModel.updateOne({_id:id}, prod)
            }
            else console.log("Datos Faltantes")
        else console.log("No hay producto para modificar.")
        const result = await productsModel.findById(id)
        return result
    }

    deleteProduct = async id=>{
        await productsModel.deleteOne({_id:id})
        const result = await productsModel.find()
        return result
    }
}
export default new Products()
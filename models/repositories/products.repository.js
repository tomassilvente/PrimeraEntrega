import getDAOS from "../daos.factory.js";
import {SaveProductsDTO} from "../dtos/products.dto.js"

const {productsDAO}= getDAOS();

export class ProductsRepository{
    constructor(){
        this.dao= productsDAO;
    }
    async getAllProducts(){
        return await this.dao.getAll();
    }
    async saveProduct(payload){
        const productsPayload = new SaveProductsDTO(payload)
        return await this.dao.saveProduct(productsPayload)
    }
}